import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/db';
import { AccountDeletion } from './accountDeletion.model';
import { User } from '../user/user.model';
import { sendResponse } from '@/lib/utils/sendResponse';

// ১. সব ডিলিট রিকোয়েস্ট দেখা (GET)
const getAllDeletionRequests = async () => {
  await dbConnect();
  const requests = await AccountDeletion.find().sort({ createdAt: -1 }).lean();
  
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Deletion requests retrieved successfully!',
    data: requests,
  });
};

// ২. রিকোয়েস্ট অ্যাপ্রুভ করে ইউজার ডিলিট করা (PATCH)
const processDeletionRequest = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await context.params;
  const { action } = await req.json(); // action can be 'completed' or 'rejected'

  const deletionRequest = await AccountDeletion.findById(id);
  if (!deletionRequest) {
    throw new Error('Request not found!');
  }

  if (action === 'completed') {
    // ইউজারের মেইন অ্যাকাউন্ট সফট ডিলিট করা
    await User.findOneAndUpdate(
      { $or: [{ email: deletionRequest.identifier }, { phoneNumber: deletionRequest.identifier }] },
      { isDeleted: true, isActive: false }
    );
    
    deletionRequest.status = 'completed';
  } else if (action === 'rejected') {
    deletionRequest.status = 'rejected';
  }

  await deletionRequest.save();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: `Account deletion request ${action} successfully.`,
    data: deletionRequest,
  });
};

export const AccountDeletionController = {
  getAllDeletionRequests,
  processDeletionRequest,
};