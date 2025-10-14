import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { public_id } = body;

    if (!public_id) {
      return NextResponse.json({ error: 'Missing public_id' }, { status: 400 });
    }

    const result = await cloudinary.v2.uploader.destroy(public_id);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    return NextResponse.json(
      { error: 'Failed to delete file', details: err },
      { status: 500 }
    );
  }
}
