// app/api/videos/route.ts - Updated version
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: [
        { courseType: 'asc' },
        { lesson: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const courseType = formData.get('courseType') as string;
    const lesson = parseInt(formData.get('lesson') as string);
    const image = formData.get('image') as File | null;

    // Validation
    if (!title || !description || !youtubeUrl || !courseType || !lesson) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    if (lesson < 1 || lesson > 10) {
      return NextResponse.json(
        { error: 'บทเรียนต้องอยู่ระหว่าง 1-10' },
        { status: 400 }
      );
    }

    // Create video
    const video = await prisma.video.create({
      data: {
        title,
        description,
        youtubeUrl,
        courseType,
        lesson,
        image: image ? `/uploads/${Date.now()}-${image.name}` : null
      }
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    );
  }
}