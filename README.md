# 🌸 PlanPilot — GenAI Event Planning Assistant

> **"Plan any celebration in minutes, not months."**
> Budgets, timelines, vendor checklists, and personalized ideas, powered by AI.

PlanPilot is a modern, elegant web application crafted like a luxury wedding-planner brand crossed with a high-performance modern SaaS tool. It is strictly **Light Theme Only**, featuring warm ivory tones (`#FBF8F3`), Fraunces serif typography, soft card shadows, and warm coral accents (`#D9695F`).

---

## 🎨 Design Tokens & Palette

- **Page Background (`--bg`)**: `#FBF8F3` (Warm ivory)
- **Surfaces (`--surface`)**: `#FFFFFF` (Cards with soft 16–24px rounding)
- **Secondary Panels (`--surface-soft`)**: `#F7EFE8`
- **Soft Highlight (`--blush`)**: `#F6DFDB`
- **Success / Checklist Done (`--sage`)**: `#DCE8DA`
- **Primary Coral (`--primary`)**: `#D9695F` (`#B9524A` hover)
- **Luxury Gold (`--accent-gold`)**: `#C9A25B`
- **Plum Accent (`--plum`)**: `#5B3A57`
- **Text (`--text`)**: `#2B2A33` (Headings & body text meeting WCAG AA contrast)
- **Muted Text (`--text-muted`)**: `#6E6A78`
- **Borders (`--border`)**: `#EDE4DB`
- **Shadows**: `0 8px 30px rgba(91, 58, 87, 0.08)`
- **Typography**: Google Fonts `"Fraunces"` (Headings) & `"DM Sans"` (Body)

---

## ⚡ Core Features & 7 Pillars

1. **Event Snapshot**:
   - Explicit editable & dismissible assumption chips (e.g. `Assumed: 50 guests ✕`).
   - Mode badge (Balanced / Budget-Saver / Luxury / Last-Minute).
   - Dynamic **Reality Check Banner** with per-head math and actionable alternatives when budgets are unrealistic.
   - **Cultural & Auspicious Notice** for Diwali, Eid, and Indian wedding traditions (Shubh Muhurat, vegetarian/Jain segregation).
   - **Alcohol & Licensing Flags** for single-day liquor permits and crowd safety.

2. **Budget Breakdown**:
   - **Recharts Donut Chart** with curated warm palette (`#D9695F`, `#C9A25B`, `#5B3A57`, `#7E9F7A`, etc.).
   - Table: Category | Share (%) | Amount | Strategic Savings Tip.
   - **Mathematical Guarantee**: Always sums to **exactly 100% and user's budget** with zero rounding drift.
   - **Interactive Live Sliders**: Auto-rebalances remaining categories when fine-tuning, with a live `Remaining: 0` indicator.
   - **Volunteer & In-Kind Tracker**: For grassroots community/volunteer events, tracks donated venues, sweet boxes, and volunteer pods.

3. **Backward-Planned Timeline**:
   - Backward-phased from event date with checkable tasks and a highlighted **"This Week"** focus card.
   - Compresses automatically for short timelines / Last-Minute mode.

4. **Vendor Due Diligence Checklist**:
   - Categorized (Venue, Catering, Decor, Photography, Sound/DJ, Permits).
   - Checkboxes with `[Ask]`, `[Confirm]`, `[Contract]`, and `[Permit/Safety]` tags.
   - Live category progress bars.

5. **Personalized Ideas & "Wow" Moment**:
   - 5–7 thematic ideas + highlighted **Signature "Wow" Moment** card.
   - 2 dedicated **Budget-Saving Alternatives**.

6. **Risks & Mitigation Playbook**:
   - Top 3 vulnerabilities (weather surprises, RSVP swings, vendor failure) with concrete backups.

7. **Next 3 Steps (This Week)**:
   - Pinned, prominent card with immediate action steps.

8. **Refine with AI & Export**:
   - Floating Refine Drawer with one-click suggestion chips ("Cut budget 15%", "Make it vegetarian/Jain-friendly", "Add rain plan").
   - Hour-by-Hour **Day-Of Run Sheet** modal.
   - Ready-to-copy **Invitation Wording** modal (Formal, Casual, WhatsApp).
   - **Print / PDF View**: Clean `@media print` stylesheet with zero UI chrome.
   - **Saved Plans**: LocalStorage scenario manager.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Installation
```bash
git clone <repo_url>
cd PlanPilot
npm install
```

### 3. Environment Variables (Optional)
To connect real Gemini AI generation via server-side proxy, create a `.env` file:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```
*(If no API key is provided, PlanPilot runs seamlessly in Smart Template Mode with deterministic allocation rules.)*

### 4. Running the App
```bash
npm run dev
```
Open [http://localhost:5174/](http://localhost:5174/) in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 Verified Scenarios (Definition of Done)
1. **👑 Jaipur Wedding**: *"Plan my sister's wedding, 200 guests, INR 12 lakh, Jaipur, December."*
2. **⚡ 2-Week Rush Birthday**: *"Surprise 30th birthday, $500, 20 people, I have 2 weeks."*
3. **🪔 Diwali Fundraiser**: *"Community Diwali fundraiser for 300 people, tiny budget, volunteers only."*
4. **❓ Vague Idea**: *"Help me plan something."*
5. **⚠️ Reality Check Wedding**: *"Budget is $1000 for a 150-guest wedding."*
