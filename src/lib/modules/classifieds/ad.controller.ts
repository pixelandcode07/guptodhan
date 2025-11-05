/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createAdValidationSchema, updateAdValidationSchema } from './ad.validation';
import { ClassifiedAdServices } from './ad.service';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';
import { IClassifiedAd } from './ad.interface';

const createAd = async (req: NextRequest) => {
  await dbConnect();


  // 1️⃣ Token verification
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Authorization token missing.');
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
  const userId = decoded.userId as string;

  // 2️⃣ FormData & images
  const formData = await req.formData();
  const images = formData.getAll('images') as File[];
  if (!images.length) throw new Error('At least one image is required.');

  const uploadResults = await Promise.all(
    images.map(async file => uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'classified-ads'))
  );

  const imageUrls = uploadResults.map(r => r.secure_url);
  // 3️⃣ Payload mapping
  const payload: any = { images: imageUrls, user: userId, };
  for (const [key, value] of formData.entries()) {
    if (key !== 'images' && typeof value === 'string') {
      if (key.startsWith('contactDetails.')) {
        const nestedKey = key.split('.')[1];
        if (!payload.contactDetails) payload.contactDetails = {};
        payload.contactDetails[nestedKey] = nestedKey === 'isPhoneHidden' ? value === 'true' : value;
      } else {
        payload[key] = value;
      }
    }
  }
  // Convert types
  if (payload.price) payload.price = Number(payload.price);
  if (payload.isNegotiable) payload.isNegotiable = payload.isNegotiable === 'true';

  // Validation
  const validatedData = createAdValidationSchema.parse(payload);
  console.log("📝 Validated data:", validatedData);

  // Build type-safe payload for Mongo
  const payloadForService: Partial<IClassifiedAd> = {
    user: new Types.ObjectId(userId),
    title: validatedData.title,
    division: validatedData.division,
    district: validatedData.district,
    upazila: validatedData.upazila,
    condition: validatedData.condition,
    authenticity: validatedData.authenticity,
    description: validatedData.description,
    price: validatedData.price,
    isNegotiable: validatedData.isNegotiable ?? false,
    images: validatedData.images,
    features: validatedData.features,
    contactDetails: {
      ...validatedData.contactDetails,
      isPhoneHidden: validatedData.contactDetails.isPhoneHidden ?? false,
    },
    category: validatedData.category ? new Types.ObjectId(validatedData.category) : undefined,
    subCategory: validatedData.subCategory ? new Types.ObjectId(validatedData.subCategory) : undefined,
    brand: validatedData.brand,
    productModel: validatedData.productModel,
    edition: validatedData.edition,
  };

  // 6️⃣ Save to DB
  const result = await ClassifiedAdServices.createAdInDB(payloadForService);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Ad posted successfully!',
    data: result,
  });
}



const getAllAds = async (_req: NextRequest) => {
  await dbConnect();
  const result = await ClassifiedAdServices.searchAdsInDB({});
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ads retrieved', data: result });
};

const getSingleAd = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const result = await ClassifiedAdServices.getSingleAdFromDB(params.id);
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ad retrieved', data: result });
};

const getPublicAds = async (_req: NextRequest) => {
  await dbConnect();
  const result = await ClassifiedAdServices.getAllPublicAdsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Public ads retrieved successfully!',
    data: result,
  });
};

const getPublicAdById = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const result = await ClassifiedAdServices.getPublicAdByIdFromDB(id);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ad retrieved successfully!',
    data: result,
  });
};

const updateAd = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) throw new Error('User ID missing');

  const body = await req.json();
  const validatedData = updateAdValidationSchema.parse(body);

  const payloadForService: Partial<IClassifiedAd> = {
    ...validatedData,
    category: validatedData.category ? new Types.ObjectId(validatedData.category) : undefined,
    subCategory: validatedData.subCategory ? new Types.ObjectId(validatedData.subCategory) : undefined,
    brand: validatedData.brand,
    productModel: validatedData.productModel,
    edition: validatedData.edition,
    contactDetails: validatedData.contactDetails
      ? {
        name: validatedData.contactDetails.name ?? '',
        phone: validatedData.contactDetails.phone ?? '',
        email: validatedData.contactDetails.email,
        isPhoneHidden: validatedData.contactDetails.isPhoneHidden ?? false,
      }
      : undefined,
  };

  const result = await ClassifiedAdServices.updateAdInDB(params.id, userId, payloadForService);

  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ad updated', data: result });
};

const deleteAd = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) throw new Error('User ID missing');

  await ClassifiedAdServices.deleteAdFromDB(params.id, userId);
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ad deleted', data: null });
};

const getPublicAdsByCategoryId = async (_req: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) => {
    await dbConnect();
    const { categoryId } = await params;
    const result = await ClassifiedAdServices.getPublicAdsByCategoryIdFromDB(categoryId);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Ads for category retrieved successfully!',
        data: result,
    });
};

const getFiltersForCategory = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId');

  if (!categoryId) {
    throw new Error('Category ID is required to get filters.');
  }
  
  const result = await ClassifiedAdServices.getFiltersForCategoryFromDB(categoryId);
  
  return sendResponse({ 
    success: true, 
    statusCode: StatusCodes.OK, 
    message: 'Filter data retrieved successfully', 
    data: result 
  });
};

export const ClassifiedAdController = { 
  createAd, 
  getAllAds,
  getSingleAd, 
  updateAd, 
  deleteAd, 
  getPublicAds,
  getPublicAdById, 
  getPublicAdsByCategoryId,
  getFiltersForCategory,
};
