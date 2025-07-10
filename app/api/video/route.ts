// app/api/videos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadVideo, uploadImage } from '@/lib/cloudinary';

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const videoFile = formData.get('videoFile') as File;
    const imageFile = formData.get('image') as File;

    if (!title || !description || !videoFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload video to Cloudinary
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
    const videoFilename = `${Date.now()}-${videoFile.name.replace(/\.[^/.]+$/, "")}`;
    
    const videoUploadResult = await uploadVideo(videoBuffer, videoFilename) as any;
    
    let imageUploadResult = null;
    if (imageFile) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imageFilename = `${Date.now()}-${imageFile.name.replace(/\.[^/.]+$/, "")}`;
      imageUploadResult = await uploadImage(imageBuffer, imageFilename) as any;
    }

    // Save to database
    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl: videoUploadResult.secure_url,
        imageUrl: imageUploadResult?.secure_url || null,
        publicId: videoUploadResult.public_id,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}