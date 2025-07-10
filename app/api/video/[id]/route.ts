// app/api/videos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadVideo, uploadImage, deleteFromCloudinary } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const videoFile = formData.get('videoFile') as File;
    const imageFile = formData.get('image') as File;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    let videoUrl = existingVideo.videoUrl;
    let imageUrl = existingVideo.imageUrl;
    let publicId = existingVideo.publicId;

    // Upload new video if provided
    if (videoFile && videoFile.size > 0) {
      // Delete old video from Cloudinary
      await deleteFromCloudinary(existingVideo.publicId, 'video');
      
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      const videoFilename = `${Date.now()}-${videoFile.name.replace(/\.[^/.]+$/, "")}`;
      const videoUploadResult = await uploadVideo(videoBuffer, videoFilename) as any;
      
      videoUrl = videoUploadResult.secure_url;
      publicId = videoUploadResult.public_id;
    }

    // Upload new image if provided
    if (imageFile && imageFile.size > 0) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imageFilename = `${Date.now()}-${imageFile.name.replace(/\.[^/.]+$/, "")}`;
      const imageUploadResult = await uploadImage(imageBuffer, imageFilename) as any;
      imageUrl = imageUploadResult.secure_url;
    }

    // Update database
    const video = await prisma.video.update({
      where: { id },
      data: {
        title,
        description,
        videoUrl,
        imageUrl,
        publicId,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Get video to delete from Cloudinary
    const video = await prisma.video.findUnique({
      where: { id }
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(video.publicId, 'video');

    // Delete from database
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