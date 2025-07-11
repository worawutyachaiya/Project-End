// app/api/quizzes/[id]/route.ts (สำหรับ PUT และ DELETE)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { questionType, question, choices, correct, score, phase } = body

    // Validate required fields
    if (!questionType || !question || !choices || !correct || !score || !phase) {
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

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        questionType,
        question: question.trim(),
        choices: choices.map((c: string) => c.trim()),
        correct,
        score: score.trim(),
        phase,
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error updating quiz:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    await prisma.quiz.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'ลบข้อสอบสำเร็จ' })
  } catch (error) {
    console.error('Error deleting quiz:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    )
  }
}