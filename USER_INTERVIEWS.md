# USER_INTERVIEWS.md

All three interviews were conducted during the week of May 22-27, 2026 via WhatsApp and in-person conversation. Each was 10-15 minutes.

---

## Interview 1 — CS Student, Personal AI User

**Name:** Anonymous (preferred)
**Role:** Computer Science Student
**Company stage:** N/A — individual user

**Summary:**
Does not pay for any AI tools personally. Gets unlimited ChatGPT access through a university/promotional deal (ChatGPT Go). Also uses Gemini occasionally for image-related work. Uses Lovable sometimes for quick prototypes. Said he uses ChatGPT for almost everything.

**Direct quotes:**
- "I don't pay for anything — I got ChatGPT Go through a free subscription so I get unlimited."
- "I use Gemini when I need image stuff, otherwise ChatGPT handles everything."
- "Lovable is useful sometimes but I wouldn't pay for it."

**Most surprising thing:**
He had no idea what plans existed or what they cost. When I showed him the Claude Max plan at $100/month he said "who pays that?" — completely unaware that teams routinely pay this per seat.

**What it changed about the design:**
Confirmed the tool should not target individual students or hobbyists. The value proposition only lands for people with real team spend. Added **"team size"** as a prominent field so the tool can immediately filter for relevant users. Also reinforced that the results page needs to show dollar amounts prominently — abstract plan names mean nothing to most people.

---

## Interview 2 — Software Engineer, Full-time at a Tech Company

**Name:** Anonymous (preferred)
**Role:** Software Engineer
**Company stage:** Growth stage company

**Summary:**
Uses an AI‑powered coding assistant integrated into VS Code (described as "vibe coding"). Company offers Cursor but employees have to actively request it — she hadn't bothered. Also uses GitHub Copilot through an "Island browser" setup, not integrated into her main editor. Said the fragmented setup was annoying but not annoying enough to fix.

**Direct quotes:**
- "The company pays for Cursor but you have to reach out to actually get it — I just haven't done it."
- "I use Copilot but it's not even in VS Code, it's through this Island browser thing."
- "I don't know what any of these tools cost, the company just pays for it."

**Most surprising thing:**
She was unaware of the full scope of tools her company was paying for. Cursor was available but she didn't know. This suggests companies are paying for seats that aren't being used — a different kind of waste the audit could flag.

**What it changed about the design:**
Added a mental note to eventually surface **"utilization"** as a metric — are you paying for seats people aren't using? Not in this MVP but a clear week 2 feature. Also confirmed that the target user is the person approving spend, not the individual engineer using the tools.

---

## Interview 3 — Founder/CTO, Early Stage Startup

**Name:** Anonymous (preferred)
**Role:** CTO / Technical Co‑founder
**Company stage:** Early stage, 4‑person tech team

**Summary:**
4‑person engineering team. Each person pays $100/month individually for Claude Max 5x. Total spend: $400/month on Claude alone. Also uses Antigravity IDE which provides free tokens that reset every few days — effectively reducing their real AI costs through free tier usage. Was not aware they could get Claude Team at $30/seat which would cost $120/month instead of $400/month.

**Direct quotes:**
- "Each of us just has our own Claude Max subscription, it works out to $400 a month for the team."
- "We use Antigravity because the tokens reset every few days so we get a lot of free usage."
- "I didn't know there was a team plan — we just all signed up individually."

**Most surprising thing:**
$280/month savings sitting right there — just from switching from 4 individual Claude Max subscriptions to Claude Team. They had never looked at the team pricing page. This is exactly the use case the audit tool is built for.

**What it changed about the design:**
This interview directly validated the audit engine's overkill detection logic. Made me more confident that the "paying for individual plans when team plans are cheaper" scenario is real and common, not just theoretical. Also added mental note to make the Credex CTA more prominent for cases like this — $400/month on a single tool is a clear signal.
