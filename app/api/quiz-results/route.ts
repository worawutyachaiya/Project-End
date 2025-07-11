// app/api/quiz-results/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      studentId, 
      quizType, 
      phase, 
      score, 
      totalScore, 
      percentage, 
      answers 
    } = body

    // Validate required fields
    if (!studentId || !quizType || !phase || score === undefined || !totalScore || !percentage) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // สร้าง table quizResult ในฐานข้อมูล (ถ้ายังไม่มี)
    const quizResult = await prisma.quizResult.create({
      data: {
        studentId,
        quizType,
        phase,
        score,
        totalScore,
        percentage,
        answers: JSON.stringify(answers), // เก็บคำตอบเป็น JSON
        completedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'บันทึกผลสอบสำเร็จ',
      id: quizResult.id
    })
  } catch (error) {
    console.error('Error saving quiz result:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกผลสอบ' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const quizType = searchParams.get('quizType')
    const phase = searchParams.get('phase')

    let whereClause: any = {}
    
    if (studentId) whereClause.studentId = studentId
    if (quizType) whereClause.quizType = quizType
    if (phase) whereClause.phase = phase

    const results = await prisma.quizResult.findMany({
      where: whereClause,
      orderBy: { completedAt: 'desc' }
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching quiz results:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงผลสอบ' },
      { status: 500 }
    )
  }
}