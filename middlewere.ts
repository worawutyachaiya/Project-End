// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  // เส้นทางที่ไม่ต้องการการยืนยันตัวตน
  const publicRoutes = ['/login', '/register', '/']
  
  // เส้นทางที่ต้องการสิทธิ์ admin
  const adminRoutes = ['/admin', '/admin/dashboard', '/admin/users', '/admin/quiz']
  
  // เส้นทางที่ต้องการการยืนยันตัวตน
  const protectedRoutes = ['/dashboard', '/quiz', '/profile', '/courses']

  // ถ้าเป็นเส้นทาง public ให้ผ่าน
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // ตรวจสอบ token
  if (!token) {
    if (protectedRoutes.some(route => pathname.startsWith(route)) || 
        adminRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    
    // ตรวจสอบสิทธิ์ admin
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    // token ไม่ถูกต้อง
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.set('token', '', { maxAge: 0 })
    return response
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}