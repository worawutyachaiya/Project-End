// app/api/quizzes/by-type/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const phase = searchParams.get('phase')
    
    // Validate parameters
    if (!type || !phase) {
      return NextResponse.json(
        { error: 'กรุณาระบุ type และ phase' },
        { status: 400 }
      )
    }

    if (!['HTML', 'CSS'].includes(type) || !['pre', 'post'].includes(phase)) {
      return NextResponse.json(
        { error: 'พารามิเตอร์ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        questionType: type,
        phase: phase
      },
      select: {
        id: true,
        question: true,
        choices: true,
        correct: true,
        score: true
      },
      orderBy: { createdAt: 'asc' }
    })
    
    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' },
      { status: 500 }
    )
  }
}