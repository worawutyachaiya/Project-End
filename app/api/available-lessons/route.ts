// app/api/available-lessons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const phase = searchParams.get('phase');
    
    if (!type || !phase) {
      return NextResponse.json(
        { error: 'กรุณาระบุ type และ phase' },
        { status: 400 }
      );
    }

    if (!['HTML', 'CSS'].includes(type) || !['pre', 'post'].includes(phase)) {
      return NextResponse.json(
        { error: 'พารามิเตอร์ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // ดึงบทเรียนที่มีข้อสอบ
    const quizzes = await prisma.quiz.findMany({
      where: {
        questionType: type,
        phase: phase
      },
      select: {
        lesson: true
      },
      distinct: ['lesson'],
      orderBy: { lesson: 'asc' }
    });

    const availableLessons = quizzes.map(quiz => quiz.lesson);
    
    return NextResponse.json(availableLessons);
  } catch (error) {
    console.error('Error fetching available lessons:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' },
      { status: 500 }
    );
  }
}