import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/db';
import { AccountDeletion } from '@/lib/modules/account-deletion/accountDeletion.model';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { identifier, reason } = body;

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: 'Identifier (Email or Phone) is required.' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const newRequest = await AccountDeletion.create({
      identifier,
      reason: reason || '',
      status: 'pending',
    });

    console.log(`✅ New Account Deletion Request from: ${identifier}`);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Account deletion request submitted successfully.',
        data: newRequest
      },
      { status: StatusCodes.CREATED }
    );

  } catch (error: any) {
    console.error('❌ Account Deletion Request Error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to submit request. Please try again later.' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}