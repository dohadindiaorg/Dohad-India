import dbConnect from '@/lib/mongodb';
import AdminUser from '@/lib/models/AdminUser';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { jsonOk, jsonError, jsonInternalError, logServerError } from '@/lib/api/route-helpers';

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid request', 400);
    }

    const { username, password } = body as { username?: unknown; password?: unknown };

    if (typeof username !== 'string' || typeof password !== 'string') {
      return jsonError('Invalid input format', 400);
    }

    await dbConnect();
    const admin = await AdminUser.findOne({ username }).lean();

    if (!admin) {
      return jsonError('Username is wrong.', 401);
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return jsonError('Your password is wrong.', 401);
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({
      user: {
        id: String(admin._id),
        username: admin.username,
        name: admin.name,
        role: admin.role,
        sessionVersion: admin.sessionVersion ?? 0,
      },
      expires,
    });

    cookies().set('session', session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return jsonOk({ message: 'Login successful' });
  } catch (error) {
    logServerError('Admin login failed', error);
    return jsonInternalError();
  }
}
