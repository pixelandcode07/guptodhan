import { NextRequest } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import { Notification } from './notification.model';
import { Device } from '../device/device.model';
import dbConnect from '@/lib/db';

const sendToSpecificDevice = async (req: NextRequest) => {
  await dbConnect();
  const { fcmToken, title, message, image } = await req.json();

  if (!fcmToken || !title || !message) {
    throw new Error('Token, Title, and Message are required');
  }

  const payload = {
    notification: { title, body: message, ...(image && { imageUrl: image }) },
    token: fcmToken,
  };

  try {
    const response = await firebaseAdmin.messaging().send(payload);
    
    await Notification.create({ 
        title, 
        message, 
        image, 
        type: 'individual', 
        status: 'sent' 
    });

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Notification sent successfully!',
      data: response,
    });
  } catch (error: any) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
      data: null, // ✅ Error Fix: Data field added
    });
  }
};

const sendToAllDevices = async (req: NextRequest) => {
  await dbConnect();
  const { title, message, image } = await req.json();

  const devices = await Device.find({ isActive: true }).distinct('fcmToken');

  if (devices.length === 0) {
      return sendResponse({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'No active devices found',
          data: null // ✅ Error Fix: Data field added
      });
  }

  const payload = {
    notification: { title, body: message, ...(image && { imageUrl: image }) },
    tokens: devices,
  };

  try {
    const response = await firebaseAdmin.messaging().sendEachForMulticast(payload);
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: `Sent to ${response.successCount} devices!`,
      data: response,
    });
  } catch (error: any) {
    return sendResponse({ 
        success: false, 
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR, 
        message: error.message,
        data: null // ✅ Error Fix: Data field added
    });
  }
};

export const NotificationController = {
  sendToSpecificDevice,
  sendToAllDevices
};