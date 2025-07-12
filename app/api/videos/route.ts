// app/api/videos/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// GET - ดึงข้อมูลวิดีโอทั้งหมด
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

// POST - สร้างวิดีโอใหม่
export async function POST(request: { formData: () => any; }) {
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const youtubeUrl = formData.get('youtubeUrl');
    const image = formData.get('image');

    let imagePath = null;
    
    // อัพโหลดรูปภาพ (ถ้ามี)
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `${Date.now()}-${image.name}`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      
      await writeFile(filepath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        youtubeUrl,
        image: imagePath,
      }
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}