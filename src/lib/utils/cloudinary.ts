
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: folder,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(new Error('Failed to upload file to Cloudinary.'));
        }
        if (result) {
          resolve(result);
        }
      },
    );

    stream.end(buffer);
  });
};


export const deleteFromCloudinary = async (url: string): Promise<void> => {
  try {
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`✅ File ${public_id} deleted from Cloudinary.`);
    }
  } catch (error) {
    console.error('❌ Cloudinary image deletion failed:', error);
  }
};