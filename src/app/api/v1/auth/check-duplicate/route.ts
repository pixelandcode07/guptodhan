import { NextResponse } from 'next/server';
import { User } from '@/lib/modules/user/user.model';
import dbConnect from '@/lib/db';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, phoneNumber } = await req.json();

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, message: 'This email is already in use. Please try another.' },
          { status: 409 }
        );
      }
    }

    if (phoneNumber) {
      const existingPhone = await User.findOne({ phoneNumber });
      if (existingPhone) {
        return NextResponse.json(
          { success: false, message: 'This phone number is already in use. Please try another.' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { success: true, message: 'Data is unique' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Duplicate Check Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server Error while checking duplicates' },
      { status: 500 }
    );
  }
}