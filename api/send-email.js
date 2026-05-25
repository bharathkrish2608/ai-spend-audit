module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  const { email, totalMonthlySavings, topRecommendation } = req.body || {};
  if (!email) {
    return res.status(400).json({ success: false, error: 'Missing email' });
  }
  const apiKey = process.env.VITE_RESEND_API_KEY;
  if (!apiKey) {
    console.error('Missing VITE_RESEND_API_KEY env var');
    return res.status(200).json({ success: false });
  }
  try {
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
      const errText = await response.text();
      console.error('Resend error:', errText);
      return res.status(200).json({ success: false });
    }
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Email send failed:', e);
    return res.status(200).json({ success: false });
  }
};
