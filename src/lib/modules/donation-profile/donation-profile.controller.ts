import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';
import { DonationProfileServices } from './donation-profile.service';
import { User } from '../user/user.model';

// ১. ড্যাশবোর্ড স্ট্যাটাস (Card Data)
const getDonationDashboardStats = async (req: NextRequest) => {
  await dbConnect();
  
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as any;
  
  let userEmail = decoded.email;
  const userId = decoded.userId;

  // 🛠 যদি টোকেনে ইমেইল না থাকে, ডাটাবেস থেকে বের করো
  if (!userEmail) {
    const user = await User.findById(userId).select('email');
    userEmail = user?.email;
  }

  if (!userEmail) {
    throw new Error('User email not found. Please log in again.');
  }

  const result = await DonationProfileServices.getUserStatsFromDB(userId, userEmail);

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
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as any;

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
  
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as any;
  const userId = decoded.userId || decoded.id; // টোকেন থেকে আইডি নেওয়া হলো

  // যদি ইমেইল না থাকে, তবে ডাটাবেস থেকে ইমেইল বের করে নিবে
  let userEmail = decoded.email;
  if (!userEmail) {
      const user = await User.findById(userId).select('email');
      userEmail = user?.email;
  }

  // ✅ MAGIC FIX: এখন সার্ভিস লেয়ারে userId এবং email দুটোই পাঠানো হচ্ছে!
  const result = await DonationProfileServices.getUserClaimsFromDB(userId, userEmail);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'My claims retrieved successfully!',
    data: result,
  });
};

const getReceivedClaims = async (req: NextRequest) => {
  await dbConnect();
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as any;
  const userId = decoded.userId || decoded.id;

  const result = await DonationProfileServices.getReceivedClaimsFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Received requests retrieved successfully!',
    data: result,
  });
};

export const DonationProfileController = {
  getDonationDashboardStats,
  getMyCampaigns,
  getMyClaims,
  getReceivedClaims,
};