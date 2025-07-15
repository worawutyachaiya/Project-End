// app/api/user-progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseType = searchParams.get('courseType');

    if (!userId || !courseType) {
      return NextResponse.json(
        { error: 'Missing userId or courseType' },
        { status: 400 }
      );
    }

    const progress = await prisma.userProgress.findMany({
      where: {
        userId: parseInt(userId),
        courseType: courseType
      },
      orderBy: { lesson: 'asc' }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseType, lesson, completed, skipped } = body;

    if (!userId || !courseType || !lesson) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_courseType_lesson: {
          userId: parseInt(userId),
          courseType: courseType,
          lesson: parseInt(lesson)
        }
      },
      update: {
        completed: completed || false,
        skipped: skipped || false,
        updatedAt: new Date()
      },
      create: {
        userId: parseInt(userId),
        courseType: courseType,
        lesson: parseInt(lesson),
        completed: completed || false,
        skipped: skipped || false
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating user progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}