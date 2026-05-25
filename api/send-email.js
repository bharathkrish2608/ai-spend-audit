export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }
  const { email, totalMonthlySavings, topRecommendation } = req.body || {};
  if (!email) {
    res.status(400).json({ success: false, error: 'Missing email' });
    return;
  }
  try {
    const apiKey = process.env.VITE_RESEND_API_KEY;
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
      res.status(500).json({ success: false });
      return;
    }
    await response.json();
    res.status(200).json({ success: true });
  } catch (e) {
    console.error('Email send failed', e);
    res.status(500).json({ success: false });
  }
}
