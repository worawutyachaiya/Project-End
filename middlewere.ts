// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ตรวจสอบว่าเป็น admin route หรือไม่
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // ตรวจสอบ authentication (ตัวอย่างแบบง่าย)
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
    
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};