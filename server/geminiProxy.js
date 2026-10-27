// Server-Side Gemini API Proxy for PlanPilot
import { GoogleGenAI } from '@google/genai';
import { PlanSchema, generateSmartPlan } from '../src/plannerCore.js';

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
              const apiKey = process.env.GEMINI_API_KEY || req.headers['x-gemini-api-key'] || '';

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

                const systemInstruction = `You are PlanPilot, an expert event planner for weddings, birthdays, and community events (fundraisers, festivals, meetups, school/NGO events). Be warm, organized and practical. Never invent specific vendor names, phone numbers or exact prices as facts; give typical price RANGES labeled as estimates and advise getting 2-3 quotes. Budgets must add up exactly to the stated total and include a 5-10% contingency. If details are missing, state assumptions and still produce a full plan. Respect culture, religion, dietary needs, accessibility and age-appropriateness; offer options rather than assuming traditions. Flag permits, licenses, crowd safety and alcohol laws for public events or alcohol service. Infer currency and locale; do not default to USD. If the budget is unrealistic for the guest count, say so plainly, give a rough per-head figure, and offer options (smaller guest list, daytime or home venue, potluck-style menu). For near-zero-budget community events, switch to an in-kind donations, sponsors and volunteers model instead of a normal budget table. Decline unsafe or illegal requests briefly and offer a safe alternative.

Follow these event-type default allocations:
Wedding: venue+catering 45-50%, photo/video 10-12%, attire/beauty 8-10%, decor/flowers 8-10%, music 6-8%, stationery/misc 4-5%, contingency 8-10%.
Birthday: venue/food 50-55%, decor/theme 15%, entertainment 15%, cake/favors 8%, contingency 7-10%.
Community: venue/permits 20-25%, food 25%, marketing 10-15%, equipment/AV 15%, volunteers/safety/insurance 10%, contingency 10%.`;

                const prompt = `Generate a complete event plan for:
Event: ${data.eventType || 'celebration'}
Guests: ${data.guests || 50}
Budget: ${data.currency || 'INR'} ${data.budget || 150000}
Location: ${data.location || 'Local city'}
Timing: ${data.timing || '1-3 months'}
Mode: ${data.mode || 'balanced'}
Vibe & Details: ${data.freeText || data.vibe || 'Warm celebratory event'}

Output pure JSON matching the requested schema. Ensure all budget category amounts sum up to EXACTLY ${data.budget || 150000}.`;

                const response = await ai.models.generateContent({
                  model: modelName,
                  contents: prompt,
                  config: {
                    systemInstruction,
                    responseMimeType: 'application/json'
                  }
                });

                const rawJson = JSON.parse(response.text.trim());
                
                // Validate & reconcile budget math
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
              } else if (r.includes('rush') || r.includes('2-month') || r.includes('fast')) {
                updatedPlan = generateSmartPlan({
                  ...updatedPlan.snapshot,
                  budget: updatedPlan.snapshot.totalBudget,
                  timing: 'under_3_weeks',
                  mode: 'lastMinute',
                  assumptionsOverride: [...updatedPlan.assumptions, 'Converted to expedited 2-month rush timeline']
                });
              } else if (r.includes('vegetarian') || r.includes('jain')) {
                updatedPlan.snapshot.culturalNotice = 'Dietary Guarantee: 100% Strict Pure Vegetarian & Jain Catering (No onion, garlic, or root vegetables on designated counter; separate segregated cookware & serving spoons).';
                updatedPlan.vendorChecklist.find(c => c.category.includes('Catering'))?.items.unshift({
                  id: 'jain1',
                  task: 'Contractually bind caterer to pure vegetarian/Jain kitchen segregation with separate oil and ladles.',
                  tag: 'Contract',
                  completed: true
                });
              } else if (r.includes('rain') || r.includes('outdoor')) {
                updatedPlan.risks.unshift({
                  risk: 'Outdoor Rain or Windstorm Vulnerability',
                  mitigation: 'Mandatory 48-hour waterproof German marquee/pagoda tent standby clause with sealed raised wooden flooring.'
                });
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true, source: 'refine', plan: updatedPlan }));
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

  let currentSum = plan.budget.reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  let diff = numBudget - currentSum;

  if (diff !== 0) {
    // Adjust contingency or largest item
    let targetRow = plan.budget.find(r => /contingency|incidentals|buffer/i.test(r.category)) || plan.budget[0];
    if (targetRow) {
      targetRow.amount = Math.max(0, targetRow.amount + diff);
      targetRow.percent = Math.round((targetRow.amount / numBudget) * 100);
    }
  }

  return plan;
}
