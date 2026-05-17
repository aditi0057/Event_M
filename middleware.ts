import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

//  "security guard"
export function middleware(request: NextRequest) {
  // Get the path of the incoming request (e.g., '/UserDashboard', '/sign-in')
  const path = request.nextUrl.pathname;

  // Define which paths are considered public and don't require login
  const isPublicPath = path === '/sign-in' || path === '/sign-up';

  // Get the authentication token from the cookies
  const token = request.cookies.get('accessToken')?.value || '';



  // 1. If the user is trying to access a PROTECTED path AND they DON'T have a token...
  if (!isPublicPath && !token) {
    // ...redirect them to the login page.
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl));
  }

  // 2. If the user is trying to access a PUBLIC path AND they ARE ALREADY logged in...
  if (isPublicPath && token) {
    // ...redirect them to the normal user dashboard. Admins are redirected after login in the sign-in page.
    return NextResponse.redirect(new URL('/UserDashboard', request.nextUrl));
  }
  
  // If neither of the above conditions are met, let them proceed to their destination.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/UserDashboard',
    '/AdminDashboard',
    '/Events/:path*',
    '/Poll/:path*',
    '/Gallery/:path*',
    '/Calendar',
    '/sign-in',
    '/sign-up',
  ],
};
