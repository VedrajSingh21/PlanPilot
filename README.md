# 🌸 PlanPilot — GenAI Celebration & Event Planner

> **"A GenAI Celebration and Event Planner that handles budgeting, timelines, guest lists, trade-off tracking and vendor coordination for weddings, birthdays and community events."**

PlanPilot is a modern, enterprise-grade event planning platform designed with a clean, warm ivory aesthetic (`#FBF8F3`), Fraunces serif typography, and coral accents (`#D9695F`). It operates on a single-column layout with a fixed 64px top navbar, zero clutter, and strict adherence to accessibility, security, and computational precision.

---

## 📌 Problem Statement Alignment & Feature Matrix

PlanPilot directly solves the core challenges of celebration and event planning across weddings, birthdays, and community gatherings:

| Core Pillar | Capabilities & Implementation |
| :--- | :--- |
| **💰 Budgeting** | Pure mathematical allocation (`/src/lib/budget.ts`) guaranteeing exact sum totals (0 rounding drift), strict 5–10% contingency allocation, zero/tiny budget handling, interactive live category rebalancing sliders, and volunteer in-kind trackers. |
| **⏳ Timelines** | Backward-planned timeline phased from event date with checkable milestones, highlighted "This Week" priority card, and a printable hour-by-hour **Day-Of Run Sheet**. |
| **👥 Guest Lists** | Dedicated **Guests** tab with full add/edit/remove CRUD, RSVP tracking (Invited, Attending, Declined, Tentative), dietary restrictions, plus-ones counter, confirmed catering headcount summary line, full CSV import & export, and AI seating/menu split generation. |
| **⚖️ Trade-off Tracking** | Dedicated **Trade-offs** engine inside the Budget tab with AI-generated decision cards (e.g., "Upgrade venue vs. invite more guests"), cost impact calculation, and a live "Decisions History" audit log that rebalances the budget in real time. |
| **🤝 Vendor Coordination** | Categorized vendor due diligence (Venue, Catering, Decor, Photography, Sound/DJ, Permits), status tracking (`To contact` / `Quoted` / `Booked`), custom quote inputs, live **Quote Comparison** against the budgeted line, and AI-drafted inquiry messages with curfew and licensing checklists. Never invents vendor names. |
| **🎉 Event Diversity** | Tailored intelligence for **Weddings** (ceremonies, traditions, high guest counts), **Birthdays** (milestones, fast-turnaround budgets), and **Community Events** (volunteers-only, zero-dollar budgets, permits). |

---

## 🏗 Architecture & System Design

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT (BROWSER)                                  |
|                                                                                   |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  |     HomeState      |   |    GeneratingState    |   |       PlanState        |  |
|  | (Intake & Samples) |   | (ARIA Busy Live Feed) |   | (Accessible ARIA Tabs) |  |
|  +--------------------+   +-----------------------+   +------------------------+  |
|                                                                                   |
|  Features: /src/features/{plan, budget, guests, vendors}                          |
|  UI Components: /src/components/{Navbar, ErrorBoundary, Modals}                   |
|  Client Storage: /src/lib/storage.ts (Safe LocalStorage with 'Clear Data' action) |
|  Math & Schema: /src/lib/schema.ts (Zod) + /src/lib/budget.ts (Pure Vitest Math)  |
+------------------------------------------+----------------------------------------+
                                           | HTTP Requests (Sanitized & Typed)
                                           v
+-----------------------------------------------------------------------------------+
|                         SERVER PROXY (Node / Express / Vite)                      |
|                                                                                   |
|  [Security Headers]  CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy|
|  [IP Rate Limiter]   40 requests / 10-minute window per IP                        |
|  [Input Sanitizer]   Max 2000 chars, strips unicode control characters            |
|  [Zod Validator]     Validates request payloads against shared Zod schemas        |
|  [In-Memory Cache]   Deduplicates identical planning prompts (30-min TTL)         |
|  [Health Check]      GET /health endpoint for container orchestrators             |
+---------------------+-------------------------------------+-----------------------+
                      |                                     |
    API Key Configured|                                     | Key Missing or Error
                      v                                     v
+------------------------------------+    +-----------------------------------------+
|     Google Gemini API (Interactions)|    |      Deterministic Template Engine      |
|  - System Prompt Injection Guard   |    |  - Instant mathematical fallback        |
|  - Structured JSON Output Schema   |    |  - Cultural & Austin-grade heuristics   |
|  - Automatic Retry on Malformed    |    |  - Verified against 5 benchmark cases   |
+------------------------------------+    +-----------------------------------------+
```

---

## 🔒 Security & Privacy

1. **Server-Side API Key Isolation**: `GEMINI_API_KEY` is exclusively read by the Node.js proxy (`server/geminiProxy.js`). It is never injected into `import.meta.env` or bundled into client assets.
2. **Strict Verification**: Verified via automated grep; `.env` is ignored by Git, and `.env.example` provides a template.
3. **Prompt Injection Hardening**: All system prompts explicitly instruct the model that user inputs are data parameters, preventing role overrides, persona alterations, or prompt leaks.
4. **Input Sanitization**: Request bodies are capped at 2,000 characters and stripped of ASCII/Unicode control characters (`\u0000-\u001F`).
5. **No Sensitive Cloud Persistence**: User plans and checklist statuses are stored exclusively on the user's device via `localStorage`. A prominent **"Clear all my data"** button allows complete removal with one click.
6. **Security Headers**: Standard CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `frame-ancestors: 'none'`.

---

## ♿ Accessibility (WCAG 2.1 AA Compliant)

- **Semantic Landmark Structure**: Clean HTML5 document outline with `<header>`, `<nav>`, `<main>`, and `<footer>`.
- **Single Heading Rule**: Exactly one `<h1>` per view, followed by a strict, logical heading hierarchy (`<h2>`, `<h3>`).
- **Full Keyboard Tab Navigation**: ARIA tablist pattern (`role="tablist"`, `role="tab"`, `role="tabpanel"`) with ArrowRight, ArrowLeft, Home, and End keyboard controls.
- **Form Controls & Touch Targets**: Every input has an explicitly linked visible `<label>`. All buttons and clickable targets strictly enforce a minimum touch target size of 44×44px.
- **Screen Reader Announcements**: Asynchronous and generation updates are announced via `aria-live="polite"` and `aria-busy="true"`.
- **Accessible Alternatives for Data**: Recharts donut charts include structured text summaries and tables for screen reader users and those with `prefers-reduced-motion`.
- **Skip Link**: Top-level "Skip to main content" link for seamless keyboard navigation.

---

## ⚡ Performance & Efficiency

- **Dynamic Code-Splitting**: Recharts donut chart is isolated in a separate chunk via `React.lazy()` (`BudgetDonutChart`), reducing the initial application bundle to under 425 kB.
- **In-Memory Query Caching**: Identical prompt inputs are hashed and served instantly from server cache without invoking external model calls.
- **Interactive Button States**: Submission and action buttons automatically disable during in-flight queries to prevent double-submissions.
- **Input Debouncing & Memoization**: Search filters, slider updates, and budget calculations utilize `useMemo` to ensure zero dropped frames on lower-powered devices.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript (Strict Mode), Vite 8, Tailwind CSS v4, Lucide React icons
- **Data Visualization**: Recharts (dynamically loaded)
- **Validation**: Zod (Single source of truth shared across client and server)
- **Testing**: Vitest
- **AI Engine**: Google GenAI SDK (`@google/genai`) with Gemini 2.5 Flash

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or 20.x+
- npm 9.x+

### 2. Installation
```bash
git clone https://github.com/VedrajSingh21/PlanPilot.git
cd PlanPilot
npm install
```

### 3. Environment Configuration
Create a `.env` file from the provided `.env.example`:
```bash
cp .env.example .env
```
Configure your keys:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=5174
```
*(If no API key is specified, PlanPilot automatically activates the Deterministic Template Planner with zero setup.)*

### 4. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server and integrated Gemini proxy on `http://localhost:5174/`. |
| `npm run build` | Runs TypeScript type checking and generates optimized production assets in `/dist`. |
| `npm run lint` | Lints all TypeScript, JavaScript, and React files using ESLint with zero warnings. |
| `npm run typecheck` | Validates TypeScript types across the entire project in strict mode (`tsc --noEmit`). |
| `npm run test` | Executes the Vitest unit test suite covering budget math and planner determinism. |
| `npm run preview` | Previews the production build locally. |

---

## 🧪 Automated Testing & Benchmark Scenarios

Run unit tests via:
```bash
npm run test
```

The test suite validates the 5 core scenarios:
1. **👑 Jaipur Wedding**: 200 guests, ₹12,00,000 budget, Jaipur venue. Tests traditional multi-vendor splits and auspicious timelines.
2. **⚡ $500 30th Birthday Rush**: 20 guests, 2-week rush turnaround. Tests backward timeline compression and DIY catering heuristics.
3. **🪔 Volunteers-Only Diwali Fundraiser**: 300 attendees, ₹0 or minimal budget. Tests in-kind tracking, zero-dollar contingency, and permits.
4. **❓ Vague Natural Language Intake**: *"Help me plan something"*. Tests parser extraction, default fallback assumptions, and reality checks.
5. **⚠️ Reality Check Wedding**: $1,000 budget for 150 guests ($6.67/head). Tests reality check warning banner and actionable budget compromises.

---

## ☁️ Deployment

### Vercel Deployment
1. Connect your repository to [Vercel](https://vercel.com).
2. Configure Environment Variables in the project settings:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `GEMINI_MODEL`: `gemini-2.5-flash`.
3. Set the Framework Preset to **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Docker & Cloud Run Deployment
PlanPilot includes a health check endpoint at `/health` returning `{ "status": "ok", "service": "planpilot-api" }` for container orchestrators.
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
EXPOSE 5174
ENV NODE_ENV=production
CMD ["node", "server/geminiProxy.js"]
```

---

## ⚠️ Limitations & Notes

- **AI Model Rate Limits**: High concurrent load on the free Gemini tier may trigger rate-limit codes (HTTP 429); the built-in server proxy safely catches these and serves deterministic plan templates seamlessly.
- **Deterministic Currency Support**: Primary currencies tested are INR (₹), USD ($), EUR (€), and GBP (£).
- **Local Data Persistence**: Stored plans exist in browser `localStorage`. Clearing browser caches or using incognito sessions will reset stored records.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
