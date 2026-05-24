# DEVLOG

## Day 1 — 2026-05-22
**Hours worked:** 4
**What I did:** Set up the project with React and Vite. Spent time figuring out Tailwind v4 configuration since it no longer uses PostCSS — uses a Vite plugin instead. Cleaned up boilerplate and built a dark themed landing page skeleton. Got everything pushed to GitHub.
**What I learned:** Tailwind v4 setup is meaningfully different from v3, the docs don't make it obvious.
**Blockers / what I'm stuck on:** Nothing blocking, foundation feels solid.
**Plan for tomorrow:** Start the audit engine — pricing data first, then rules.

## Day 2 — 2026-05-23
**Hours worked:** 7
**What I did:** Built the entire audit engine. Created pricing.js with all tool and plan prices, rules.js for overkill detection, redundant tool overlap flagging and cheaper plan suggestions, calculators.js for savings math, and recommendations.js that combines everything into a single runAudit function. Tested in browser console — Cursor Business 2 seats correctly returned $40/month savings. Wired up basic view switching in App.jsx between home, audit and results.
**What I learned:** Keeping logic completely outside React makes it much easier to test and reason about.
**Blockers / what I'm stuck on:** SpendForm is still a stub, needs to be the real thing tomorrow.
**Plan for tomorrow:** Build real SpendForm with dynamic tool entries and localStorage persistence, then AuditResults component.

## Day 3 — 2026-05-24
**Hours worked:** 6
**What I did:** Built the real SpendForm with dynamic tool entries, plan dropdowns, auto-calculated spend, and localStorage persistence. Built AuditResults page with savings hero, per-tool breakdown, and Credex CTA. Wired up Supabase — every audit now saves to the database on submission. Added React Router with three routes: home, audit form, and public result page. Each audit gets a unique UUID-based URL that fetches from Supabase on load. Tested refresh on the public URL — results persist correctly.
**What I learned:** Supabase URL must not include /rest/v1/ — that broke the client for a while. Environment variables in Vite only reload on server restart, not live.
**Blockers / what I'm stuck on:** Lead capture form and Anthropic summary still to build. User interviews not done yet — need to do those tomorrow.
**Plan for tomorrow:** Lead capture form, Anthropic AI summary, Open Graph tags, deploy to Vercel.