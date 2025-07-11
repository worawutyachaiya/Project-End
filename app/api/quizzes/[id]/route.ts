// app/api/admin/quizzes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    const body = await request.json()
    const { questionType, question, choices, correct, score, phase } = body

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!questionType || !question || !choices || !correct || !score || !phase) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id }
    })

    if (!existingQuiz) {
      return NextResponse.json(
        { error: 'ไม่พบข้อสอบที่ต้องการแก้ไข' },
        { status: 404 }
      )
    }

    const updatedQuiz = await prisma.quiz.update({
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

    return NextResponse.json(updatedQuiz)
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id }
    })

    if (!existingQuiz) {
      return NextResponse.json(
        { error: 'ไม่พบข้อสอบที่ต้องการลบ' },
        { status: 404 }
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