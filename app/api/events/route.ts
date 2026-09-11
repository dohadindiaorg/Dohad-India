import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import {
  getAdminEvents,
  invalidateEventsCache,
  queryEvents,
  resolveUniqueEventSlug,
  slugifyTitle,
} from '@/lib/data/events';
import { jsonOk, jsonError, jsonInternalError, logServerError, requireAdmin } from '@/lib/api/route-helpers';
import { parseEventDateInput } from '@/lib/event-dates';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminList = searchParams.get('admin') === 'true';

    if (adminList) {
      const { unauthorized } = await requireAdmin();
      if (unauthorized) return unauthorized;
      return jsonOk(await getAdminEvents());
    }

    const category = searchParams.get('category') ?? undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const parsedLimit = parseInt(searchParams.get('limit') || '50', 10);
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 50;

    const events = await queryEvents({
      category,
      published: true,
      featured,
      limit,
    });
    return jsonOk(events);
  } catch (error) {
    logServerError('Failed to list events', error);
    return jsonInternalError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { unauthorized } = await requireAdmin();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const data = await request.json();

    if (!data.slug && data.title) {
      const baseSlug = slugifyTitle(data.title);
      data.slug = await resolveUniqueEventSlug(baseSlug);
    }

    if (data.startDate) {
      data.startDate = parseEventDateInput(data.startDate);
    }
    if (data.endDate) {
      data.endDate = parseEventDateInput(data.endDate);
    }

    const event = await Event.create(data);
    invalidateEventsCache();

    return jsonOk(event, 201);
  } catch (error: any) {
    if (error?.code === 11000) {
      return jsonError('An event with this slug already exists', 409);
    }
    logServerError('Failed to create event', error);
    return jsonInternalError();
  }
}
