// app/api/admin/quizzes/route.ts - Updated version with lesson support
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: [
        { questionType: 'asc' },
        { phase: 'asc' },
        { lesson: 'asc' },
        { createdAt: 'desc' }
      ]
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionType, question, choices, correct, score, phase, lesson } = body

    // Validate required fields
    if (!questionType || !question || !choices || !correct || !score || !phase || !lesson) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Validate choices array
    if (!Array.isArray(choices) || choices.length !== 4 || choices.some(c => !c.trim())) {
      return NextResponse.json(
        { error: 'ตัวเลือกคำตอบต้องมี 4 ข้อและไม่ว่างเปล่า' },
        { status: 400 }
      )
    }

    // Validate lesson number
    if (lesson < 1 || lesson > 10) {
      return NextResponse.json(
        { error: 'บทเรียนต้องอยู่ระหว่าง 1-10' },
        { status: 400 }
      )
    }

    const quiz = await prisma.quiz.create({
      data: {
        questionType,
        question: question.trim(),
        choices: choices.map((c: string) => c.trim()),
        correct,
        score: score.trim(),
        phase,
        lesson: parseInt(lesson),
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    )
  }
}