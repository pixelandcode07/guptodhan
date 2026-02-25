import { Device } from "@/lib/modules/device/device.model";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { sendResponse } from "@/lib/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/db";

export const POST = catchAsync(async (req) => {
  await dbConnect();
  const { token, deviceType, userId } = await req.json();

  if (!token) throw new Error('FCM Token is required');

  const deviceData = await Device.findOneAndUpdate(
    { fcmToken: token },
    { 
      fcmToken: token, 
      deviceType: deviceType || 'android',
      userId: userId || null, 
      lastUsed: new Date() 
    },
    { upsert: true, new: true }
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Device registered successfully!',
    data: deviceData, // এখানে ডাটা পাঠানো হয়েছে
  });
});