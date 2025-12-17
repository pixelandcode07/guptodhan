import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';
import { DonationProfileServices } from './donation-profile.service';

// ১. ড্যাশবোর্ড স্ট্যাটাস (Card Data)
const getDonationDashboardStats = async (req: NextRequest) => {
  await dbConnect();
  
  // টোকেন থেকে ইউজার ইনফো বের করা
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
  
  const result = await DonationProfileServices.getUserStatsFromDB(decoded.userId, decoded.email);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User donation stats retrieved successfully!',
    data: result,
  });
};

// ২. আমার তৈরি করা ক্যাম্পেইন (My Donations)
const getMyCampaigns = async (req: NextRequest) => {
  await dbConnect();
  
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);

  const result = await DonationProfileServices.getUserCampaignsFromDB(decoded.userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'My campaigns retrieved successfully!',
    data: result,
  });
};

// ৩. আমার ক্লেইম বা আবেদন (My Claims)
const getMyClaims = async (req: NextRequest) => {
  await dbConnect();
  
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);

  // ক্লেইম মডেলে userId নেই, তাই আমরা ইমেইল দিয়ে খুঁজব
  const result = await DonationProfileServices.getUserClaimsFromDB(decoded.email);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'My claims retrieved successfully!',
    data: result,
  });
};

export const DonationProfileController = {
  getDonationDashboardStats,
  getMyCampaigns,
  getMyClaims,
};