import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { donationConfigSchema } from './donation-config.validation';
import { DonationConfigServices } from './donation-config.service';
import dbConnect from '@/lib/db';
import { ZodError } from 'zod';
import { revalidateTag } from 'next/cache'; // 🔥 revalidateTag import

// POST: Create New Config
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

    // 🔥 FIX: ২য় আর্গুমেন্ট যোগ করা হয়েছে { expire: 0 }
    // এটি ক্যাশ সাথে সাথে ডিলিট করে দিবে (Immediate Invalidation)
    revalidateTag('donation-config', { expire: 0 });

    return sendResponse({ 
      success: true, 
      statusCode: StatusCodes.CREATED, 
      message: 'Donation config set successfully!', 
      data: result 
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendResponse({ 
        success: false, 
        statusCode: StatusCodes.BAD_REQUEST, 
        message: 'Validation failed', 
        data: error.issues 
      });
    }
    return sendResponse({ 
      success: false, 
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR, 
      message: (error as Error).message,
      data: null
    });
  }
};

// PATCH: Update Existing Config
const updateDonationConfig = async (req: NextRequest) => {
  await dbConnect();
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const isImageRemoved = formData.get('isImageRemoved') === 'true';

    const payload: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'image' && key !== 'isImageRemoved') {
        payload[key] = value;
      }
    }

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'donation-config');
      payload.image = uploadResult.secure_url;
    } 
    else if (isImageRemoved) {
      payload.image = ""; 
    }

    const result = await DonationConfigServices.updateDonationConfigInDB(payload);

    // 🔥 FIX: ২য় আর্গুমেন্ট যোগ করা হয়েছে { expire: 0 }
    // আপডেট করার সাথে সাথেই পাবলিক পেজে নতুন ডাটা দেখাবে
    revalidateTag('donation-config', { expire: 0 });

    return sendResponse({ 
      success: true, 
      statusCode: StatusCodes.OK, 
      message: 'Donation config updated successfully!', 
      data: result 
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return sendResponse({ 
        success: false, 
        statusCode: StatusCodes.BAD_REQUEST, 
        message: 'Validation failed', 
        data: error.issues 
      });
    }
    return sendResponse({ 
      success: false, 
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR, 
      message: (error as Error).message,
      data: null
    });
  }
};

// GET: Fetch Config
const getDonationConfig = async (_req: NextRequest) => {
  await dbConnect();
  const result = await DonationConfigServices.getDonationConfigFromDB();
  return sendResponse({ 
    success: true, 
    statusCode: StatusCodes.OK, 
    message: 'Donation config retrieved!', 
    data: result 
  });
};

// DELETE: Remove Config
const deleteDonationConfig = async (_req: NextRequest) => {
  await dbConnect();
  await DonationConfigServices.deleteDonationConfigFromDB();
  
  // 🔥 FIX: ২য় আর্গুমেন্ট যোগ করা হয়েছে { expire: 0 }
  revalidateTag('donation-config', { expire: 0 });

  return sendResponse({ 
    success: true, 
    statusCode: StatusCodes.OK, 
    message: 'Donation config deleted successfully!', 
    data: null 
  });
};

export const DonationConfigController = {
  setDonationConfig,
  updateDonationConfig,
  getDonationConfig,
  deleteDonationConfig,
};