import { NextRequest } from 'next/server';
import {
  getSiteSettings,
  patchSiteSettings,
} from '@/lib/data/site-settings';
import { jsonOk, jsonInternalError, logServerError, requireAdmin } from '@/lib/api/route-helpers';

export async function GET() {
  try {
    const { unauthorized } = await requireAdmin();
    if (unauthorized) return unauthorized;

    const settings = await getSiteSettings();
    return jsonOk(settings);
  } catch (error) {
    logServerError('Failed to load settings', error);
    return jsonInternalError();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { unauthorized } = await requireAdmin();
    if (unauthorized) return unauthorized;

    const updates = await request.json();
    const settings = await patchSiteSettings(updates);
    return jsonOk(settings);
  } catch (error) {
    logServerError('Failed to update settings', error);
    return jsonInternalError();
  }
}

/** @deprecated Use PATCH for partial updates */
export async function POST(request: NextRequest) {
  return PATCH(request);
}
