import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Define the protected routes where users need to be authenticated
  const protectedRoutes = [
    '/home',
    '/announcements',
    '/calendar',
    '/reports',
  ];

  const cookieStore = cookies();
  const authToken = cookieStore.get('authToken');
  const isAuthenticated = authToken;

  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Specify the routes you want to apply middleware to (e.g., all routes)
export const config = {
  matcher: [
    '/home/:path*',
    '/announcements/:path*',
    '/calendar/:path*',
    '/reports/:path*',
  ],
};
