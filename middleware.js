import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(req) {

  const { pathname } = req.nextUrl;

  // Define the protected routes where users need to be authenticated
  const protectedRoutes = [
    '/home',
  ];

  // Get user authentication status (e.g., from a cookie or session)
  const cookieStore = cookies();
  const authToken = cookieStore.get('authToken');
  const isAuthenticated = authToken;

  // If the user is not authenticated and tries to access a protected route
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    // Redirect them to the login page
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }

  // Allow the request to continue if authenticated or if the route is not protected
  return NextResponse.next();
}

// Specify the routes you want to apply middleware to (e.g., all routes)
export const config = {
  matcher: [
    '/home/:path*',
  ],
};
