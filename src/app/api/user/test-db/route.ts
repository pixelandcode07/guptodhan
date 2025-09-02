// ফাইল পাথ: src/app/api/test-db/route.ts


import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/db';


export async function GET() {
  try {
    await dbConnect();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'MongoDB connected successfully!' 
      },
      { status: StatusCodes.OK },
    );
  } catch (error: any) {
    console.error('--- DATABASE CONNECTION FAILED ---:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'MongoDB connection failed!', 
        error: error.message 
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}