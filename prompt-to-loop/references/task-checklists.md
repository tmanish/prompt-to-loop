# Task checklists

For each task type, here are the checklist fields used in step 1's specification audit. When auditing a user prompt, check each field against the prompt content. Count how many are specified (explicitly or by strong implication) vs. how many are gaps.

The fields are listed in rough priority order — the first fields tend to be the highest-leverage if missing.

---

## Website / landing page

1. **Primary purpose** — sell / inform / convert / showcase / portfolio
2. **Catalog or page count** — single page / 2–5 pages / 6+ pages / product catalog with N items
3. **Aesthetic reference** — competitor, vibe, or example URL (e.g., "minimal like Stripe", "playful like Duolingo")
4. **Audience** — who reads or buys
5. **Voice / tone** — only ask when copy will be generated
6. **Tech stack** — single-file HTML / React / Next.js / Webflow / Framer
7. **Deployment target** — local file / Vercel / Netlify / custom domain / not deploying
8. **Responsive breakpoints** — mobile-only / mobile+desktop / mobile+tablet+desktop

---

## Dashboard / data viz

1. **Data source** — file path / API / hardcoded sample / SQL query
2. **Metrics or KPIs to show** — what numbers matter
3. **Time range** — single point / last N days / live / historical
4. **Audience** — executive / analyst / customer / internal ops
5. **Interactivity** — static / filterable / drilldown / live-updating
6. **Output format** — web page / Figma mockup / PDF / embedded widget
7. **Refresh cadence** — one-off / scheduled / streaming

---

## Mobile app prototype

1. **Platform** — iOS / Android / both
2. **Core user flow** — what the user is trying to accomplish
3. **Screen count** — single screen / 2–5 / 6+
4. **Fidelity** — low-fi wireframe / hi-fi mockup / clickable prototype / functional
5. **Tool / stack** — Figma / single-file HTML / React Native / SwiftUI
6. **Auth required** — yes / no
7. **Backend integration** — none / mock data / live API
8. **Aesthetic reference** — competitor or example

---

## Figma file / design mockup

1. **Component or screen count** — single / a few / a system
2. **Fidelity** — wireframe / hi-fi mockup
3. **Aesthetic reference** — design system, competitor, example
4. **Design system / token source** — building from scratch / using existing / shadcn / Material / custom
5. **Audience for the file** — engineers (needs handoff specs) / clients (needs polish) / portfolio
6. **Responsive / auto-layout** — required or single-size

---

## Slide deck / presentation

1. **Slide count** — short (5–10) / medium (10–25) / long (25+)
2. **Audience** — internal team / external client / public / investors
3. **Purpose** — pitch / training / readout / status update / educational
4. **Format** — PPTX / Google Slides / Figma / Keynote / single-file HTML
5. **Voice / tone** — formal / conversational / technical
6. **Visual style** — text-heavy / image-heavy / data-heavy / minimal
7. **Talk duration** — drives slide pacing

---

## Document / report / article

1. **Length** — word count range (short under 500 / medium 500–2000 / long 2000+)
2. **Audience** — who reads
3. **Purpose** — inform / persuade / instruct / entertain
4. **Voice / tone** — formal / conversational / technical / playful
5. **Format** — markdown / docx / PDF / blog post / newsletter
6. **Citations needed** — yes / no / informal mentions only
7. **Visual elements** — charts / tables / images / pure text

---

## Agent / automation / script

1. **Trigger** — manual run / scheduled / event-driven (webhook, file change)
2. **Input data** — what comes in
3. **Output or side effect** — what changes in the world
4. **LLM model** — none / specified model / model-agnostic
5. **Tools or APIs needed** — list of external services
6. **Runtime environment** — local / cloud function / container / cron
7. **Error handling expectations** — fail loudly / retry / silent fallback
8. **Logging / observability** — none / file log / structured logs / metrics

---

## API or backend service

1. **Endpoints needed** — list of routes
2. **Authentication** — none / API key / OAuth / JWT
3. **Data model** — what entities exist
4. **Storage** — in-memory / SQLite / Postgres / NoSQL / external service
5. **Runtime / framework** — Node/Express / Python/FastAPI / Go / serverless
6. **Deployment target** — local / Railway / Fly / AWS / Cloudflare Workers
7. **Rate limiting or quotas** — none / per-key / per-IP

---

## Data analysis / notebook

1. **Data source** — file / API / database
2. **Question being answered** — the specific analytical question
3. **Output type** — chart / table / report / model / decision
4. **Audience** — self / team / stakeholder
5. **Format** — Jupyter notebook / Python script / docx report / dashboard
6. **Statistical depth** — descriptive only / inferential / predictive / causal
7. **Data cleaning required** — clean already / light cleanup / heavy cleanup

---

## Game / interactive demo

1. **Genre or core mechanic** — what the player does
2. **Platform** — web / mobile / desktop
3. **Scope** — single-file demo / full project
4. **Visual style** — text-based / 2D / 3D / minimal
5. **Input method** — keyboard / touch / mouse / mixed
6. **Length** — single-session / progression-based
7. **Engine / framework** — vanilla JS / canvas / Phaser / Three.js / Unity
8. **Audio** — none / sound effects / music / both

---

## Fallback for unmatched task types

When the task doesn't fit any of the 10 above, use these three slots:

1. **Scope / size** — how big is the thing
2. **Reference frame** — what does "good" look like (competitor, vibe, example)
3. **Output format** — what artifact the user actually wants
