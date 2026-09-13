const RESEND_API_URL = 'https://api.resend.com/emails';

function requireResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error('Email is not configured');
  }

  return { apiKey, from };
}

export function getContactRecipient() {
  const configured =
    process.env.CONTACT_EMAIL ||
    process.env.EMAIL_TO ||
    process.env.EMAIL_FROM ||
    '';

  const match = configured.match(/<([^>]+)>/);
  const address = (match ? match[1] : configured).trim();

  if (address && address.includes('@')) {
    return address;
  }

  return 'contact@dohadindia.org';
}

export function getAdminOtpRecipient() {
  const configured = process.env.ADMIN_EMAIL || '';
  const match = configured.match(/<([^>]+)>/);
  const address = (match ? match[1] : configured).trim().toLowerCase();

  if (!address || !address.includes('@')) {
    throw new Error('ADMIN_EMAIL is not configured');
  }

  return address;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const { apiKey, from } = requireResendConfig();

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!response.ok) {
    console.error('Resend email sending failed', { status: response.status });
    throw new Error('Email sending failed');
  }

  return response.json();
}
