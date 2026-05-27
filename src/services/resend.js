export async function sendConfirmationEmail(email, totalMonthlySavings, topRecommendation) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, totalMonthlySavings, topRecommendation })
    });
    if (!response.ok) {
      console.error('Resend email server error', await response.text());
      return null;
    }
    return await response.json();
  } catch (e) {
    console.error('Email send failed silently:', e);
    return null;
  }
}
