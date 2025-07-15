// app/api/quizzes/by-lesson/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const phase = searchParams.get('phase');
    const lesson = searchParams.get('lesson');
    
    // Validate parameters
    if (!type || !phase || !lesson) {
      return NextResponse.json(
        { error: 'กรุณาระบุ type, phase และ lesson' },
        { status: 400 }
      );
    }

    if (!['HTML', 'CSS'].includes(type) || !['pre', 'post'].includes(phase)) {
      return NextResponse.json(
        { error: 'พารามิเตอร์ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const lessonNum = parseInt(lesson);
    if (isNaN(lessonNum) || lessonNum < 1 || lessonNum > 10) {
      return NextResponse.json(
        { error: 'บทเรียนต้องอยู่ระหว่าง 1-10' },
        { status: 400 }
      );
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        questionType: type,
        phase: phase,
        lesson: lessonNum
      },
      select: {
        id: true,
        question: true,
        choices: true,
        correct: true,
        score: true,
        lesson: true
      },
      orderBy: { createdAt: 'asc' }
    });
    
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes by lesson:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' },
      { status: 500 }
    );
  }
}