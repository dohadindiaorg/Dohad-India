import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import { invalidateEventsCache } from '@/lib/data/events';
import {
  jsonOk,
  jsonError,
  jsonInternalError,
  logServerError,
  requireAdmin,
  getVerifiedAdminSession,
} from '@/lib/api/route-helpers';
import { parseEventDateInput } from '@/lib/event-dates';
import { deleteCloudinaryUrls } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

function collectEventImageUrls(event: {
  featuredImage?: string;
  galleryImages?: unknown;
}) {
  const urls: string[] = [];
  if (typeof event.featuredImage === 'string') urls.push(event.featuredImage);
  if (Array.isArray(event.galleryImages)) {
    for (const image of event.galleryImages) {
      if (typeof image === 'string') urls.push(image);
      else if (image && typeof image === 'object' && 'url' in image && typeof image.url === 'string') {
        urls.push(image.url);
      }
    }
  }
  return urls;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const event = await Event.findById(params.id).lean();

    if (!event) {
      return jsonError('Event not found', 404);
    }

    if (!event.published) {
      const session = await getVerifiedAdminSession();
      if (!session) {
        return jsonError('Event not found', 404);
      }
    }

    return jsonOk(event);
  } catch (error) {
    logServerError('Failed to load event', error);
    return jsonInternalError();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { unauthorized } = await requireAdmin();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const data = await request.json();
    if (data.startDate) {
      data.startDate = parseEventDateInput(data.startDate);
    }
    if (data.endDate) {
      data.endDate = parseEventDateInput(data.endDate);
    }
    const event = await Event.findByIdAndUpdate(params.id, data, {
      new: true,
      lean: true,
    });

    if (!event) {
      return jsonError('Event not found', 404);
    }

    invalidateEventsCache();
    return jsonOk(event);
  } catch (error) {
    logServerError('Failed to update event', error);
    return jsonInternalError();
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { unauthorized } = await requireAdmin();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const event = await Event.findByIdAndDelete(params.id);

    if (!event) {
      return jsonError('Event not found', 404);
    }

    await deleteCloudinaryUrls(collectEventImageUrls(event));
    invalidateEventsCache();
    return jsonOk({ message: 'Event deleted successfully' });
  } catch (error) {
    logServerError('Failed to delete event', error);
    return jsonInternalError();
  }
}
