// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Upload video to Cloudinary
export const uploadVideo = async (file: Buffer, filename: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'course-videos',
        public_id: filename,
        chunk_size: 6000000, // 6MB chunks
        eager: [
          { width: 300, height: 200, crop: 'pad', audio_codec: 'none' },
          { width: 160, height: 100, crop: 'crop', gravity: 'south', audio_codec: 'none' }
        ],
        eager_async: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(file);
  });
};

// Upload image to Cloudinary
export const uploadImage = async (file: Buffer, filename: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'course-images',
        public_id: filename,
        transformation: [
          { width: 400, height: 300, crop: 'fill' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(file);
  });
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId: string, resourceType: 'video' | 'image' = 'video') => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};