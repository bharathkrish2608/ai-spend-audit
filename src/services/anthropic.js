export async function generateSummary(recommendations, totalMonthlySavings, useCase, teamSize) {
  try {
    const response = await fetch('/api/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recommendations, totalMonthlySavings, useCase, teamSize })
    });
    const data = await response.json();
    return data.summary;
  } catch (e) {
    return "Based on your audit, your team has opportunities to optimize AI tool spend. Review the recommendations below to reduce monthly costs and ensure you're on the right plans for your team size.";
  }
}
