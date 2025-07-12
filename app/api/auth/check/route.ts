// app/api/auth/check/route.ts
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'ไม่พบ token' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as any

    return NextResponse.json({
      user: {
        id: decoded.userId,
        studentId: decoded.studentId,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role
      },
      isAuthenticated: true
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Token ไม่ถูกต้อง' },
      { status: 401 }
    )
  }
}