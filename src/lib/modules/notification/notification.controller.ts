import { NextRequest } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { firebaseAdmin } from '@/lib/firebaseAdmin'; // আপনার বানানো ফাইল
import { Notification } from './notification.model';
import dbConnect from '@/lib/db';

const sendBroadcastNotification = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const { title, message, image } = body;

  if (!title || !message) {
    throw new Error('Title and Message are required');
  }

  // ১. Firebase Payload তৈরি
  const payload = {
    notification: {
      title: title,
      body: message,
      ...(image && { imageUrl: image }), // ইমেজ থাকলে অ্যাড হবে
    },
    // 🔥 অ্যাপ ডেভেলপারকে বলবেন অ্যাপ ওপেন হলে যেন 'all_users' টপিকে সাবস্ক্রাইব করে।
    topic: 'all_users', 
  };

  try {
    // ২. ফায়ারবেসে পাঠানো
    const response = await firebaseAdmin.messaging().send(payload);

    // ৩. ডাটাবেসে হিস্ট্রি সেভ করা
    await Notification.create({
      title,
      message,
      image,
      type: 'broadcast',
      status: 'sent'
    });

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Notification sent successfully to all users!',
      data: response,
    });

  } catch (error: any) {
    console.error('FCM Error:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to send notification',
      data: error.message,
    });
  }
};

export const NotificationController = {
  sendBroadcastNotification,
};