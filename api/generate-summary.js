export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { recommendations, totalMonthlySavings, useCase, teamSize } = req.body;
  try {
    const apiKey = process.env.VITE_ANTHROPIC_API_KEY;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Write a ~100 word personalized paragraph summarizing an AI spend audit. Use case: ${useCase}. Team size: ${teamSize}. Total monthly savings: $${totalMonthlySavings}. Top recommendation: ${recommendations && recommendations[0] ? recommendations[0].recommendedAction : 'optimize your plans'}.`
          }
        ]
      })
    });
    if (!response.ok) throw new Error('Anthropic API error');
    const data = await response.json();
    const summary = data.content?.[0]?.text || 'No summary';
    return res.status(200).json({ summary });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ summary: 'Your audit summary is ready. Review the recommendations for insights.' });
  }
}
