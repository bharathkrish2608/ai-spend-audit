# AI Spend Audit

A free web app that audits your team's AI tool spend and finds where you're overpaying.

Built as a lead generation tool for [Credex](https://credex.rocks) — a platform that sells discounted AI infrastructure credits.

**Live URL:** https://ai-spend-audit-lyart-nine.vercel.app

---

## Screenshots

> Add 3 screenshots here — landing page, audit form, results page
> Or add a Loom link: [Screen recording](your-loom-link)

---

## Quick Start

### Install and run locally

```bash
git clone https://github.com/bharathkrish2608/ai-spend-audit.git
cd ai-spend-audit
npm install
cp .env.example .env
# Fill in your API keys in .env
npm run dev
```

### Environment variables
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ANTHROPIC_API_KEY=
VITE_RESEND_API_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=

### Deploy

Push to GitHub and import to Vercel. Add environment variables in Vercel dashboard.

### Run tests

```bash
npm run test
```

---

## Decisions

**1. No TypeScript**
The assignment had a 7-day window. TypeScript would have added setup overhead and slowed down iteration. The audit engine is pure functions that are easy to test without types. For a production codebase I would add TypeScript from day one.

**2. Supabase instead of Django**
Started with Django but switched on day 1. Supabase gave a real Postgres database with a REST API and no backend server to maintain. The time saved went into features instead of configuration.

**3. Vercel serverless functions for API proxying**
Anthropic and Resend block direct browser calls due to CORS. Instead of building a separate backend server, I used Vercel's built-in serverless functions in the api/ folder. Zero additional infrastructure.

**4. Hardcoded audit rules instead of AI**
The audit engine uses deterministic if/else logic, not an LLM. This was intentional — the recommendations need to be financially defensible and explainable. An LLM generating savings recommendations would be unpredictable and hard to verify. AI is only used for the summary paragraph where exact accuracy is less critical.

**5. No auth**
The assignment explicitly said no login required. Keeping it authless meant faster development and lower friction for users. Each audit gets a UUID-based public URL instead of user accounts.

<img width="1894" height="885" alt="Screenshot 2026-05-27 134128" src="https://github.com/user-attachments/assets/c673a2a0-8db3-4624-aa58-4d3ae64dc687" />
<img width="1414" height="855" alt="Screenshot 2026-05-27 134137" src="https://github.com/user-attachments/assets/cafa7650-dab9-4415-85b3-682c9ce83b33" />
<img width="1157" height="818" alt="Screenshot 2026-05-27 134151" src="https://github.com/user-attachments/assets/179cd3e6-20df-4de4-a301-d7457608b03f" />
<img width="908" height="576" alt="Screenshot 2026-05-27 134157" src="https://github.com/user-attachments/assets/c4f485df-09ff-461b-a8df-90d06d23cd92" />

