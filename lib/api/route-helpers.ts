import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import AdminUser from '@/lib/models/AdminUser';

const ADMIN_ROLES = new Set(['admin', 'superadmin']);

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonInternalError() {
  return jsonError('Unable to complete the request.', 500);
}

export function logServerError(context: string, error: unknown) {
  const name = error instanceof Error ? error.name : 'Error';
  console.error(context, name);
}

type AdminSession = NonNullable<Awaited<ReturnType<typeof getSession>>>;

type AdminCheck =
  | { session: AdminSession; unauthorized: null }
  | { session: null; unauthorized: NextResponse };

export async function getVerifiedAdminSession(): Promise<AdminSession | null> {
  try {
    const session = await getSession();
    const user = session?.user;
    if (!user?.id) {
      return null;
    }

    const tokenRole = user.role || 'admin';
    if (!ADMIN_ROLES.has(tokenRole)) {
      return null;
    }

    await dbConnect();
    const admin = await AdminUser.findById(user.id)
      .select('role sessionVersion')
      .lean();

    if (!admin) {
      return null;
    }

    const dbRole = admin.role || 'admin';
    if (!ADMIN_ROLES.has(dbRole)) {
      return null;
    }

    const tokenVersion = user.sessionVersion ?? 0;
    const dbVersion = admin.sessionVersion ?? 0;
    if (tokenVersion !== dbVersion) {
      return null;
    }

    return session;
  } catch (error) {
    logServerError('Admin session verification failed', error);
    return null;
  }
}

export async function requireAdmin(): Promise<AdminCheck> {
  const session = await getVerifiedAdminSession();
  if (!session) {
    return { session: null, unauthorized: jsonError('Unauthorized', 401) };
  }
  return { session, unauthorized: null };
}
