// app/api/videos/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// PUT - อัพเดทวิดีโอ
export async function PUT(request: { formData: () => any; }, { params }: any) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const youtubeUrl = formData.get('youtubeUrl');
    const image = formData.get('image');

    let updateData: {
      title: any;
      description: any;
      youtubeUrl: any;
      image?: string;
    } = {
      title,
      description,
      youtubeUrl,
    };

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
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

// DELETE - ลบวิดีโอ
export async function DELETE(request: any, { params }: any) {
  try {
    const { id } = params;
    
    // ลบรูปภาพ (ถ้ามี)
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (video?.image) {
      const filepath = path.join(process.cwd(), 'public', video.image);
      try {
        await unlink(filepath);
      } catch (error) {
        console.log('Failed to delete image file:', error);
      }
    }

    await prisma.video.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}