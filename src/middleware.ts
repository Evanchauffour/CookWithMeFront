import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    const authRoutes = ['/login', '/signup'];

    if (!token && !authRoutes.includes(req.nextUrl.pathname)) {
      console.log(req.nextUrl.pathname);
      
        console.log('redirecting to login');
        
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (token && authRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|public).*)"],
};
