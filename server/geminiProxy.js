// Server-Side Gemini API Proxy for PlanPilot
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { PlanSchema, generateSmartPlan } from '../src/plannerCore.js';

function getApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/GEMINI_API_KEY\s*=\s*([^\r\n]+)/);
      if (match) return match[1].trim();
    }
  } catch (e) {
    // ignore
  }
  return '';
}

export function createGeminiProxy() {
  return {
    name: 'planpilot-gemini-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/plan' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const apiKey = getApiKey() || req.headers['x-gemini-api-key'] || '';

              if (!apiKey) {
                // Fallback directly to deterministic planner
                const plan = generateSmartPlan(data);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, source: 'template', plan }));
                return;
              }

              // Real Gemini API Call with Structured Output
              try {
                const ai = new GoogleGenAI({ apiKey });
                const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

                const systemInstruction = `You are PlanPilot, an expert event planner for weddings, birthdays, and community events (fundraisers, festivals, meetups, school/NGO events). Be warm, organized and practical.
- Never invent specific vendor names, phone numbers or exact prices as facts; give typical price RANGES labeled as estimates and advise getting 2-3 quotes.
- Budgets must add up exactly to the stated total and include a 5-10% contingency line.
- Respect culture, religion, dietary needs, accessibility and age-appropriateness.
- Flag permits, licenses, crowd safety and alcohol laws for public events or alcohol service.
- If the budget is unrealistic for the headcount, state so plainly in snapshot.realityCheck (isUnrealistic=true, perHead, message, suggestions).
- For near-zero-budget community events, switch to an in-kind donations, sponsors and volunteer pods model (isVolunteersOnly=true).
- Return pure valid JSON conforming strictly to the requested schema.`;

                const prompt = `Generate a complete event plan for:
Event: ${data.eventType || 'celebration'}
Guests: ${data.guests || 50}
Budget: ${data.currency || 'INR'} ${data.budget || 150000}
Location: ${data.location || 'Local city'}
Timing: ${data.timing || '1-3 months'}
Mode: ${data.mode || 'balanced'}
Vibe & Details: ${data.freeText || data.vibe || 'Warm celebratory event'}

Return pure JSON matching this exact structure:
{
  "snapshot": {
    "eventType": "${data.eventType || 'wedding'}",
    "eventName": "Event Name",
    "tagline": "A short elegant tagline",
    "guests": ${data.guests || 50},
    "totalBudget": ${data.budget || 150000},
    "currency": "${data.currency || 'INR'}",
    "timingText": "${data.timing || '1-3 months'}",
    "location": "${data.location || 'Local'}",
    "vibe": "Warm elegant ambiance",
    "mode": "${data.mode || 'balanced'}",
    "realityCheck": { "isUnrealistic": false, "perHead": 0, "message": "", "suggestions": [] }
  },
  "assumptions": ["Assumed 150 guests", "Estimated at local venue", "Includes 10% contingency reserve"],
  "budget": [
    { "id": "b1", "category": "Venue & Catering", "percent": 45, "amount": 0, "tip": "Savings tip" }
  ],
  "timeline": [
    { "phase": "This Month", "isThisWeek": true, "tasks": [{ "id": "t1", "text": "Task description", "completed": false }] }
  ],
  "vendorChecklist": [
    { "category": "Catering", "items": [{ "id": "vc1", "task": "Check license", "tag": "Ask", "completed": false }] }
  ],
  "ideas": [
    { "title": "Concept title", "desc": "Concept description", "type": "theme" }
  ],
  "savingIdeas": [
    { "title": "Saving alternative 1", "desc": "Description" }
  ],
  "risks": [
    { "risk": "Identified risk", "mitigation": "Mitigation strategy" }
  ],
  "nextSteps": ["Step 1", "Step 2", "Step 3"],
  "inviteText": { "formal": "Draft 1", "casual": "Draft 2", "whatsapp": "Draft 3" }
}

CRITICAL: Every budget item amount must sum up to EXACTLY ${data.budget || 150000}.`;

                const response = await ai.models.generateContent({
                  model: modelName,
                  contents: prompt,
                  config: {
                    systemInstruction,
                    responseMimeType: 'application/json'
                  }
                });

                const rawJson = JSON.parse(response.text.trim());
                
                // Reconcile budget math to guarantee exact match
                let reconciledPlan = reconcileBudgetMath(rawJson, data.budget);

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, source: 'gemini', plan: reconciledPlan }));
              } catch (geminiError) {
                console.warn('Gemini API call failed, using smart template fallback:', geminiError.message);
                const plan = generateSmartPlan(data);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, source: 'template', plan, error: geminiError.message }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/refine' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const { refinement, currentPlan } = data;
              const apiKey = getApiKey() || req.headers['x-gemini-api-key'] || '';

              // Apply refinement to plan
              let updatedPlan = JSON.parse(JSON.stringify(currentPlan));
              const r = refinement.toLowerCase();

              if (r.includes('cut budget') || r.includes('15%')) {
                const newBudget = Math.round(updatedPlan.snapshot.totalBudget * 0.85);
                updatedPlan = generateSmartPlan({
                  ...updatedPlan.snapshot,
                  budget: newBudget,
                  mode: 'budgetSaver',
                  assumptionsOverride: [...updatedPlan.assumptions, 'Budget trimmed by 15%']
                });
              } else if (apiKey) {
                // Call Gemini for smart refinement if key exists
                try {
                  const ai = new GoogleGenAI({ apiKey });
                  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

                  const refinePrompt = `You are PlanPilot event planner. The user wants to refine their event blueprint:
Refinement request: "${refinement}"
Current event snapshot:
Event: ${updatedPlan.snapshot.eventName} (${updatedPlan.snapshot.eventType})
Guests: ${updatedPlan.snapshot.guests}
Budget: ${updatedPlan.snapshot.currency} ${updatedPlan.snapshot.totalBudget}

Please update the plan accordingly. Keep the total budget equal to ${updatedPlan.snapshot.totalBudget}.
Output pure JSON matching the PlanSchema.`;

                  const resp = await ai.models.generateContent({
                    model: modelName,
                    contents: refinePrompt,
                    config: { responseMimeType: 'application/json' }
                  });

                  const parsedUpdated = JSON.parse(resp.text.trim());
                  if (parsedUpdated && parsedUpdated.snapshot && parsedUpdated.budget) {
                    updatedPlan = reconcileBudgetMath(parsedUpdated, updatedPlan.snapshot.totalBudget);
                  }
                } catch {
                  // Fallback: append note
                  updatedPlan.assumptions.push(`Refined: ${refinement}`);
                }
              } else {
                updatedPlan.assumptions.push(`Refined: ${refinement}`);
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true, source: 'gemini-refine', plan: updatedPlan }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

function reconcileBudgetMath(plan, targetBudget) {
  if (!plan || !plan.budget || !Array.isArray(plan.budget)) return plan;
  const numBudget = Number(targetBudget) || 150000;

  // Ensure every item has an integer amount
  let running = 0;
  plan.budget.forEach((row, i) => {
    if (i === plan.budget.length - 1) {
      row.amount = numBudget - running;
    } else {
      row.amount = Math.round((numBudget * (row.percent || 10)) / 100);
      running += row.amount;
    }
  });

  return plan;
}
