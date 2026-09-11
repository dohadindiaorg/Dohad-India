import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber';
import {
  getNewsletterSubscribers,
  invalidateNewsletterCache,
} from '@/lib/data/newsletter';
import { jsonOk, jsonError, jsonInternalError, logServerError, requireAdmin } from '@/lib/api/route-helpers';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  try {
    const { unauthorized } = await requireAdmin();
    if (unauthorized) return unauthorized;

    const subscribers = await getNewsletterSubscribers();
    return jsonOk(subscribers);
  } catch (error) {
    logServerError('Failed to list newsletter subscribers', error);
    return jsonInternalError();
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid request', 400);
    }

    const data = body as { email?: unknown; name?: unknown; affiliation?: unknown };
    const email = typeof data.email === 'string' ? data.email.toLowerCase().trim() : '';
    const name = typeof data.name === 'string' ? data.name.trim().slice(0, 200) : '';
    const affiliation =
      typeof data.affiliation === 'string' ? data.affiliation.trim().slice(0, 200) : '';

    if (!email || !EMAIL_PATTERN.test(email) || email.length > 254) {
      return jsonError('Please provide a valid email address', 400);
    }

    await dbConnect();

    const existing = await NewsletterSubscriber.findOne({ email }).lean();
    if (existing) {
      return jsonOk({ message: 'Already subscribed' });
    }

    const subscriber = await NewsletterSubscriber.create({
      email,
      name: name || 'Subscriber',
      affiliation: affiliation || undefined,
    });
    invalidateNewsletterCache();

    return jsonOk({ id: subscriber._id, message: 'Subscribed' }, 201);
  } catch (error: any) {
    if (error?.code === 11000) {
      return jsonOk({ message: 'Already subscribed' });
    }
    logServerError('Failed to subscribe to newsletter', error);
    return jsonInternalError();
  }
}
