import { getContactRecipient, sendEmail } from '@/lib/email';
import { jsonOk, jsonError, jsonInternalError, logServerError } from '@/lib/api/route-helpers';
import { clientIp, consumeIpSendSlot } from '@/lib/otp';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 200;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid request', 400);
    }

    const payload = body as {
      name?: unknown;
      email?: unknown;
      subject?: unknown;
      message?: unknown;
    };

    const name = typeof payload.name === 'string' ? payload.name.trim() : '';
    const email = typeof payload.email === 'string' ? payload.email.trim() : '';
    const subject = typeof payload.subject === 'string' ? payload.subject.trim() : '';
    const message = typeof payload.message === 'string' ? payload.message.trim() : '';

    if (!name) return jsonError('Name is required', 400);
    if (!email || !EMAIL_PATTERN.test(email)) return jsonError('Please provide a valid email address', 400);
    if (!message) return jsonError('Message is required', 400);
    if (name.length > MAX_NAME) return jsonError('Name is too long', 400);
    if (email.length > 254) return jsonError('Email is too long', 400);
    if (subject.length > MAX_SUBJECT) return jsonError('Subject is too long', 400);
    if (message.length > MAX_MESSAGE) return jsonError('Message is too long', 400);

    const ipLimit = consumeIpSendSlot(`contact:${clientIp(request)}`);
    if (!ipLimit.allowed) {
      return jsonError('Please wait before sending another message.', 429);
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject || 'Website contact form');
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

    try {
      await sendEmail({
        to: getContactRecipient(),
        replyTo: email,
        subject: `Contact form: ${subject || 'New message'}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>New website contact message</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Message:</strong></p>
            <p>${safeMessage}</p>
          </div>
        `,
      });
    } catch (error) {
      logServerError('Contact form email failed', error);
      return jsonError('Unable to send your message right now. Please try again later.', 503);
    }

    return jsonOk({ message: 'Thank you. Your message has been sent.' });
  } catch (error) {
    logServerError('Contact form failed', error);
    return jsonInternalError();
  }
}
