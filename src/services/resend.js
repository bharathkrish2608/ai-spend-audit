export async function sendConfirmationEmail(email, totalMonthlySavings, topRecommendation) {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your AI Spend Audit Results',
      html: `<p>Your audit is complete</p>
<p>You could save $${totalMonthlySavings}/month</p>
${topRecommendation ? `<p>Top recommendation: ${topRecommendation}</p>` : ''}
<p>Visit <a href="https://credex.rocks">credex.rocks</a> to learn about discounted AI credits</p>`
    })
  });
  if (!response.ok) {
    console.error('Resend email error', await response.text());
    return null;
  }
  return await response.json();
}
