// app/api/pretest-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseType = searchParams.get('courseType');
    const userId = searchParams.get('userId');

    if (!courseType || !userId) {
      return NextResponse.json(
        { error: 'Missing courseType or userId' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าผู้ใช้ทำ pretest ครบทุกบทเรียนหรือยัง
    const pretestResults = await prisma.quizResult.findMany({
      where: {
        userId: parseInt(userId),
        quizType: courseType,
        phase: 'pre'
      }
    });

    // ตรวจสอบว่าทำครบ 10 บทเรียนหรือยัง
    const completedLessons = pretestResults.map(result => result.lesson);
    const allLessons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const isCompleted = allLessons.every(lesson => completedLessons.includes(lesson));

    return NextResponse.json({
      completed: isCompleted,
      completedLessons,
      totalLessons: 10
    });

  } catch (error) {
    console.error('Error checking pretest status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}