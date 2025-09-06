/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest } from 'next/server';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import {
  createAdValidationSchema,
  updateAdValidationSchema,
} from './ad.validation';
import { IClassifiedAd } from './ad.interface';
import { ClassifiedAdServices } from './ad.service';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/db';

// ===============================
// বিজ্ঞাপন তৈরি কন্ট্রোলার
// ===============================
const createAd = async (req: NextRequest) => {
  await dbConnect();

  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'User ID missing in headers',
      data: null,
    });
  }

  const formData = await req.formData();

  const images = formData.getAll('images') as File[];
  if (!images.length) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'At least one image is required',
      data: null,
    });
  }

  const uploadResults = await Promise.all(
    images.map(async (file) =>
      uploadToCloudinary(
        Buffer.from(await file.arrayBuffer()),
        'classified-ads'
      )
    )
  );
  const imageUrls = uploadResults.map((r) => r.secure_url);

  const payload: any = { user: userId, images: imageUrls };

  for (const [key, value] of formData.entries()) {
    if (key !== 'images') {
      if (key.startsWith('contactDetails.')) {
        const nestedKey = key.split('.')[1];
        if (!payload.contactDetails) payload.contactDetails = {};
        payload.contactDetails[nestedKey] = value;
      } else {
        payload[key] = value;
      }
    }
  }

  // Type conversions
  if (payload.price) payload.price = Number(payload.price);
  if (payload.isNegotiable)
    payload.isNegotiable = payload.isNegotiable === 'true';
  if (payload.contactDetails) {
    payload.contactDetails.isPhoneHidden =
      payload.contactDetails.isPhoneHidden === 'true';
  }

  // Validate
  const validatedData = createAdValidationSchema.parse(payload);

  // Final payload
const payloadForService: Partial<IClassifiedAd> = {
  ...validatedData,
  user: new Types.ObjectId(validatedData.user),
  category: new Types.ObjectId(validatedData.category),
  subCategory: validatedData.subCategory ? new Types.ObjectId(validatedData.subCategory) : undefined,
  contactDetails: {
    name: validatedData.contactDetails?.name ?? '',
    phone: validatedData.contactDetails?.phone ?? '',
    isPhoneHidden: validatedData.contactDetails?.isPhoneHidden ?? false,
  },
  upazila: validatedData.upazila, 
};


  const result = await ClassifiedAdServices.createAdInDB(payloadForService);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Ad posted successfully!',
    data: result,
  });
};

// ===============================
// সকল বিজ্ঞাপন দেখার কন্ট্রোলার (ফিল্টার সহ)
// ===============================
const getAllAds = async (req: NextRequest) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const filters: Record<string, any> = {};

  const division = searchParams.get('division');
  const district = searchParams.get('district');
  const upazila = searchParams.get('upazila');

  if (division) filters.division = division;
  if (district) filters.district = district;
  if (upazila) filters.upazila = upazila;

  const result = await ClassifiedAdServices.getAllAdsFromDB(filters);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ads retrieved successfully!',
    data: result,
  });
};

// ===============================
// এক বিজ্ঞাপন দেখার কন্ট্রোলার
// ===============================
const getSingleAd = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;

  const result = await ClassifiedAdServices.getSingleAdFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ad retrieved successfully!',
    data: result,
  });
};

// ===============================
// বিজ্ঞাপন আপডেট কন্ট্রোলার
// ===============================
const updateAd = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();

  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'User ID missing in headers',
      data: null,
    });
  }

  const { id } = params;
  const body = await req.json();
  const validatedData = updateAdValidationSchema.parse(body);

  const payloadForService: Partial<IClassifiedAd> = {
    ...validatedData,
    category: validatedData.category
      ? new Types.ObjectId(validatedData.category)
      : undefined,
    subCategory: validatedData.subCategory
      ? new Types.ObjectId(validatedData.subCategory)
      : undefined,
    contactDetails: validatedData.contactDetails
      ? {
          name: validatedData.contactDetails.name ?? '',
          phone: validatedData.contactDetails.phone ?? '',
          isPhoneHidden: validatedData.contactDetails.isPhoneHidden ?? false,
        }
      : undefined,
  };

  const result = await ClassifiedAdServices.updateAdInDB(
    id,
    userId,
    payloadForService
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ad updated successfully!',
    data: result,
  });
};

// ===============================
// বিজ্ঞাপন ডিলিট কন্ট্রোলার
// ===============================
const deleteAd = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();

  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'User ID missing in headers',
      data: null,
    });
  }

  const { id } = params;
  await ClassifiedAdServices.deleteAdFromDB(id, userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ad deleted successfully!',
    data: null,
  });
};

// ===============================
// একসাথে export
// ===============================
export const ClassifiedAdController = {
  createAd,
  getAllAds,
  getSingleAd,
  updateAd,
  deleteAd,
};
