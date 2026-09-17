import 'server-only';

export async function sendNotificationEmail(subject: string, text: string) {
  const apiKey = process.env.EMAIL_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  if (!apiKey || !to) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Форум-Фестиваль «Преображение» <onboarding@resend.dev>',
        to,
        subject,
        text
      })
    });
  } catch (e) {
    console.error('[email] failed to send notification:', e);
  }
}
