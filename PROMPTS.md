# PROMPTS.md

## AI Summary Prompt

### Where it's used
`api/generate-summary.js` — Vercel serverless function called after every audit submission.

### The prompt
Write a ~100 word personalized paragraph summarizing an AI spend audit.
Use case: ${useCase}.
Team size: ${teamSize}.
Total monthly savings: $${totalMonthlySavings}.
Top recommendation: ${recommendations[0].recommendedAction}.


### Why I wrote it this way
Kept it short and direct. The model doesn't need context about what an AI audit is — it just needs the specific numbers and use case to generate a useful paragraph. Adding more instructions made the output longer and more generic. Shorter prompt = more focused output.

### What I tried that didn't work
First version included a system message with "You are an AI spend optimization expert." This made the output sound more robotic and formal. Removing it made the tone more natural.

Second attempt used a longer prompt asking for bullet points and a headline. The output was too long and didn't fit the design — needed a single flowing paragraph not a structured response.

### Fallback
If the API call fails for any reason the app falls back to:
"Based on your audit, your team has opportunities to optimize AI tool spend. Review the recommendations below to reduce monthly costs and ensure you're on the right plans for your team size."

### Model used
claude-haiku-4-5 via Anthropic API
