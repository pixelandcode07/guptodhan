import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { donationConfigSchema } from './donation-config.validation';
import { DonationConfigServices } from './donation-config.service';
import dbConnect from '@/lib/db';
import { ZodError } from 'zod';

// অ্যাডমিন নতুন কনফিগারেশন সেট করবে
const setDonationConfig = async (req: NextRequest) => {
  await dbConnect();
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    const payload: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'image') {
        payload[key] = value;
      }
    }

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'donation-config');
      payload.image = uploadResult.secure_url;
    }

    const validatedData = donationConfigSchema.parse(payload);
    const result = await DonationConfigServices.setDonationConfigInDB(validatedData);

    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Donation config set successfully!', data: result });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendResponse({ success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'Validation failed', data: error.issues });
    }
    return sendResponse({ success: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: (error as Error).message });
  }
};

// যে কেউ কনফিগারেশন দেখতে পারবে
const getDonationConfig = async (_req: NextRequest) => {
  await dbConnect();
  const result = await DonationConfigServices.getDonationConfigFromDB();
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Donation config retrieved!', data: result });
};

const deleteDonationConfig = async (_req: NextRequest) => {
  await dbConnect();
  await DonationConfigServices.deleteDonationConfigFromDB();
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Donation config deleted successfully!', data: null });
};

export const DonationConfigController = {
  setDonationConfig,
  getDonationConfig,
  deleteDonationConfig,
};