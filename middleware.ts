import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/sign-in' || path === '/sign-up';
  const token = request.cookies.get('accessToken')?.value || '';

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/UserDashboard', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
  ],
};
