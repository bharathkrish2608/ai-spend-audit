export async function generateSummary(recommendations, totalMonthlySavings, useCase, teamSize) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [
          {
            role: 'user',
            content: `Write a ~100 word personalized paragraph summarizing the audit results. Mention the use case (${useCase}), team size (${teamSize}), total monthly savings (${totalMonthlySavings}), and the top recommendation (${recommendations && recommendations[0] ? recommendations[0] : ''}).`
          }
        ]
      })
    });
    const data = await response.json();
    if (response.ok && data && data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text.trim();
    }
    return "Based on your audit, your team has opportunities to optimize AI tool spend. Review the recommendations below to reduce monthly costs and ensure you're on the right plans for your team size.";
  } catch (e) {
    return "Based on your audit, your team has opportunities to optimize AI tool spend. Review the recommendations below to reduce monthly costs and ensure you're on the right plans for your team size.";
  }
}
