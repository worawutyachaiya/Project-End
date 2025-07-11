// app/api/videos/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// PUT - Update video
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const imageFile = formData.get('image') as File | null;

    // Validate required fields
    if (!title || !description || !youtubeUrl) {
      return NextResponse.json(
        { error: 'Title, description, and YouTube URL are required' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Get existing video
    const existingVideo = await prisma.video.findUnique({
      where: { id }
    });

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    let imagePath = existingVideo.image;

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const filename = `${Date.now()}-${imageFile.name}`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      
      // Save new file
      await writeFile(filepath, buffer);
      imagePath = `/uploads/${filename}`;

      // Delete old image if exists
      if (existingVideo.image) {
        try {
          const oldFilepath = path.join(process.cwd(), 'public', existingVideo.image);
          await unlink(oldFilepath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
    }

    // Update video record
    const video = await prisma.video.update({
      where: { id },
      data: {
        title,
        description,
        youtubeUrl,
        image: imagePath,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// DELETE - Delete video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    // Get existing video
    const existingVideo = await prisma.video.findUnique({
      where: { id }
    });

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Delete image file if exists
    if (existingVideo.image) {
      try {
        const filepath = path.join(process.cwd(), 'public', existingVideo.image);
        await unlink(filepath);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Delete video record
    await prisma.video.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}