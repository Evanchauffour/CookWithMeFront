// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { protectedRoutes } from './utils/routes';

export function middleware(request: NextRequest) {
  const isUserLoggedIn = !!request.cookies.get('BEARER');
  const urlPath = request.nextUrl.pathname;

  if (protectedRoutes.some(route => urlPath.startsWith(route)) && !isUserLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*', '/api/:path*'],
};
