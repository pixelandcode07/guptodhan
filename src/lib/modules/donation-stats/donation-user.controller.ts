import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import dbConnect from '@/lib/db';
import { User } from '../user/user.model';

const getDonationUsers = async (req: NextRequest) => {
  await dbConnect();

  try {
    // MongoDB Aggregation Pipeline
    // এটি ইউজার কালেকশন থেকে ডাটা আনবে এবং চেক করবে কে কয়টি ডোনেশন এবং ক্লেইম করেছে
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'donationcampaigns', // Mongoose কালেকশন নাম (plural & lowercase)
          localField: '_id',
          foreignField: 'creator',
          as: 'campaigns'
        }
      },
      {
        $lookup: {
          from: 'donationclaims', // Mongoose কালেকশন নাম (plural & lowercase)
          localField: 'email', // Claims এ আমরা ইমেইল দিয়ে ইউজার ট্র্যাক করছি
          foreignField: 'email',
          as: 'claims'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          profilePicture: 1,
          createdAt: 1,
          donationCount: { $size: '$campaigns' }, // মোট ক্যাম্পেইন সংখ্যা
          claimCount: { $size: '$claims' }        // মোট ক্লেইম সংখ্যা
        }
      },
      { $sort: { donationCount: -1 } } // যারা বেশি ডোনেট করেছে তারা উপরে থাকবে
    ]);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Donation users retrieved successfully!',
      data: users,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: (error as Error).message,
      data: null,
    });
  }
};

export const DonationUserController = {
  getDonationUsers,
};