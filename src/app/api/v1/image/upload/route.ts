import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = '/var/www/uploads';
const CDN_BASE = 'https://cdn.guptodhan.com/uploads';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'general';

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Unique filename বানাও
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // Folder বানাও যদি না থাকে
    const uploadFolder = path.join(UPLOAD_DIR, folder);
    await mkdir(uploadFolder, { recursive: true });

    // File save করো
    const filePath = path.join(uploadFolder, filename);
    await writeFile(filePath, buffer);

    const url = `${CDN_BASE}/${folder}/${filename}`;

    return NextResponse.json({
      secure_url: url,
      public_id: `${folder}/${filename}`,
      url: url,
    });
  } catch (err) {
    console.error('Upload failed:', err);
    return NextResponse.json(
      { error: 'Upload failed', details: err },
      { status: 500 }
    );
  }
}