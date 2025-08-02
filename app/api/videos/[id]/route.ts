// app/api/videos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Types
interface RouteParams {
  params: {
    id: string;
  };
}

interface UpdateData {
  title: string;
  description: string;
  youtubeUrl: string;
  courseType?: string;
  lesson?: number;
  image?: string;
}

// PUT - อัพเดทวิดีโอ
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const courseType = formData.get('courseType') as string;
    const lesson = formData.get('lesson') as string;
    const image = formData.get('image') as File | null;

    const updateData: UpdateData = {
      title,
      description,
      youtubeUrl,
    };

    // เพิ่ม courseType และ lesson ถ้ามี
    if (courseType) {
      updateData.courseType = courseType;
    }
    if (lesson) {
      updateData.lesson = parseInt(lesson);
    }

    // อัพโหลดรูปภาพใหม่ (ถ้ามี)
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `${Date.now()}-${image.name}`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      
      await writeFile(filepath, buffer);
      updateData.image = `/uploads/${filename}`;
    }

    const video = await prisma.video.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

// DELETE - ลบวิดีโอ
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // ลบรูปภาพ (ถ้ามี)
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (video?.image) {
      const filepath = path.join(process.cwd(), 'public', video.image);
      try {
        await unlink(filepath);
      } catch (unlinkError) {
        console.error('Failed to delete image file:', unlinkError);
      }
    }

    await prisma.video.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}