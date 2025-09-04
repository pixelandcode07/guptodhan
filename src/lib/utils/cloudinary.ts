// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\utils\cloudinary.ts

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Cloudinary কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @description একটি ফাইলকে Buffer আকারে Cloudinary-তে আপলোড করে
 * @param buffer ফাইলের Buffer
 * @param folder Cloudinary-তে যে ফোল্ডারে সেভ হবে
 * @returns Cloudinary থেকে পাওয়া আপলোডের বিস্তারিত তথ্য
 */
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

/**
 * @description একটি URL থেকে public_id বের করে Cloudinary থেকে ছবিটি ডিলিট করে
 * @param url ছবির সম্পূর্ণ URL
 */
export const deleteFromCloudinary = async (url: string): Promise<void> => {
  try {
    // URL থেকে public_id বের করার জন্য Regex
    // उदा: "folder/filename" অংশটি বের করে
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`✅ File ${public_id} deleted from Cloudinary.`);
    }
  } catch (error) {
    console.error('❌ Cloudinary image deletion failed:', error);
    // আমরা এখানে এরর থ্রো করব না, কারণ মূল কাজটি (প্রোফাইল আপডেট) যেন আটকে না যায়
  }
};