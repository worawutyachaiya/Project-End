// app/api/quizzes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // เปลี่ยนเป็น Promise
) {
  try {
    const { id: idParam } = await params // await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // your existing logic here
    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(updatedQuiz)
  } catch (error) {
    console.error('Error updating quiz:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดต' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // เปลี่ยนเป็น Promise
) {
  try {
    const { id: idParam } = await params // await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'ไม่พบข้อสอบ' },
        { status: 404 }
      )
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // เปลี่ยนเป็น Promise
) {
  try {
    const { id: idParam } = await params // await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    await prisma.quiz.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'ลบข้อสอบสำเร็จ' })
  } catch (error) {
    console.error('Error deleting quiz:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบ' },
      { status: 500 }
    )
  }
}