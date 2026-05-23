Devlog — AuditAI

Day 1 — May 22, 2026
Hours worked: 4

Set up the project with React and Vite. Spent a bit of time figuring out Tailwind v4 configuration since it doesn't use PostCSS anymore (it uses a Vite plugin now). Cleaned up the boilerplate code and built a dark-themed landing page. Got it pushed to GitHub successfully.

Day 2 — May 23, 2026
Hours worked: 4

Built the core audit engine. Created pricing.js with plan prices and rules.js for checking overkill, redundant tool overlaps (Claude vs ChatGPT), and cheaper plans. Combined everything in recommendations.js and tested it in the browser console. Also wired up basic view switching in App.jsx from Home to Audit/Results views.
