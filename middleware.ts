import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

const protectedRoutes = [
  '/admin/dashboard',
  '/admin/events',
  '/admin/newsletter',
  '/admin/advisory',
  '/admin/documents',
  '/admin/settings',
];
const publicRoutes = ['/admin/login'];
const ADMIN_ROLES = new Set(['admin', 'superadmin']);

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === '/admin') {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get('session')?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;
  const role = session?.user?.role;
  const isAdmin = Boolean(session && role && ADMIN_ROLES.has(role));

  if (isProtectedRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }

  if (isPublicRoute && isAdmin) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
