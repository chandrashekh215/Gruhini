import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret',
});

export async function uploadImageToCloudinary(fileBuffer: Buffer): Promise<string> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'demo') {
    // Fallback image if Cloudinary credentials not configured locally
    return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'gruhini' },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed'));
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function deleteImageFromCloudinary(imageUrl: string): Promise<void> {
  try {
    const parts = imageUrl.split('upload/');
    if (parts.length < 2) return;
    const withVersion = parts[1];
    const withoutVersion = withVersion.replace(/^v\d+\//, '');
    const publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete image:', error);
  }
}
