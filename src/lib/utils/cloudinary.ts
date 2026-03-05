import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = '/var/www/uploads';
const CDN_BASE = 'https://cdn.guptodhan.com/uploads';

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
): Promise<any> => {
  try {
    const ext = 'jpg';
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const uploadFolder = path.join(UPLOAD_DIR, folder);
    await mkdir(uploadFolder, { recursive: true });

    const filePath = path.join(uploadFolder, filename);
    await writeFile(filePath, buffer);

    const url = `${CDN_BASE}/${folder}/${filename}`;

    return {
      secure_url: url,
      public_id: `${folder}/${filename}`,
      url: url,
      format: ext,
      resource_type: 'image',
    };
  } catch (error) {
    console.error('VPS upload error:', error);
    throw new Error('Failed to upload file to VPS.');
  }
};

export const deleteFromCloudinary = async (url: string): Promise<void> => {
  try {
    if (!url || !url.includes('cdn.guptodhan.com')) return;

    const { unlink } = await import('fs/promises');
    const urlPath = url.replace(CDN_BASE, '');
    const filePath = path.join(UPLOAD_DIR, urlPath);
    await unlink(filePath);
    console.log(`✅ File deleted from VPS: ${filePath}`);
  } catch (error) {
    console.error('❌ VPS image deletion failed:', error);
  }
};