module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { recommendations, totalMonthlySavings, useCase, teamSize } = req.body;
  const apiKey = process.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ summary: `Based on your audit, you could save $${totalMonthlySavings}/month by optimizing your AI tool subscriptions.` });
  }
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `Write a 2-3 sentence personalized summary of an AI spend audit. Use case: ${useCase}. Team size: ${teamSize}. Monthly savings potential: $${totalMonthlySavings}. Top recommendation: ${recommendations && recommendations[0] ? recommendations[0].recommendedAction : 'optimize your plans'}. Be direct and specific.`
          }
        ]
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic error:', errText);
      return res.status(200).json({ summary: `Based on your audit, you could save $${totalMonthlySavings}/month by optimizing your AI tool subscriptions.` });
    }
    const data = await response.json();
    const summary = data.content && data.content[0] && data.content[0].text;
    return res.status(200).json({ summary: summary || `You could save $${totalMonthlySavings}/month on AI tools.` });
  } catch (e) {
    console.error('generate-summary error:', e);
    return res.status(200).json({ summary: `Based on your audit, you could save $${totalMonthlySavings}/month by optimizing your AI tool subscriptions.` });
  }
};
