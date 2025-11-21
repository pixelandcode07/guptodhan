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
import { verifyToken } from '@/lib/utils/jwt'; // JWT Verify function
import { IClassifiedAd } from './ad.interface';

// ==========================================
// 🔐 HELPER: Secure User ID Extraction
// ==========================================
// এটি কোড রিপিটেশন কমাবে এবং সিকিউরিটি নিশ্চিত করবে
const getUserIdFromToken = (req: NextRequest): string => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Authorization token missing or invalid.');
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
  return decoded.userId as string;
};

// ==========================================
// 🚀 CONTROLLERS
// ==========================================

// 1. Create Ad (Form Data + Images)
const createAd = async (req: NextRequest) => {
  await dbConnect();

  // 🔒 Verify User
  const userId = getUserIdFromToken(req);

  // 📦 Handle Form Data
  const formData = await req.formData();
  const images = formData.getAll('images') as File[];

  // Image Validation
  if (!images.length) throw new Error('At least one image is required.');

  // Upload to Cloudinary
  const uploadResults = await Promise.all(
    images.map(async file => uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'classified-ads'))
  );
  const imageUrls = uploadResults.map(r => r.secure_url);

  // Construct Payload
  const payload: any = { images: imageUrls, user: userId };

  for (const [key, value] of formData.entries()) {
    if (key !== 'images' && typeof value === 'string') {
      // Nested 'contactDetails' handling for FormData
      if (key.startsWith('contactDetails.')) {
        const nestedKey = key.split('.')[1];
        if (!payload.contactDetails) payload.contactDetails = {};
        // Convert boolean string to actual boolean
        payload.contactDetails[nestedKey] = nestedKey === 'isPhoneHidden' ? value === 'true' : value;
      } else {
        payload[key] = value;
      }
    }
  }

  // Type Conversion
  if (payload.price) payload.price = Number(payload.price);
  if (payload.isNegotiable) payload.isNegotiable = payload.isNegotiable === 'true';

  // Zod Validation
  const validatedData = createAdValidationSchema.parse(payload);

  // Prepare Service Payload
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
    // status default is 'pending' in model
  };

  const result = await ClassifiedAdServices.createAdInDB(payloadForService);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Ad posted successfully!',
    data: result,
  });
};

// 2. Get All Ads (Internal/General use)
const getAllAds = async (_req: NextRequest) => {
  await dbConnect();
  const result = await ClassifiedAdServices.searchAdsInDB({});
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ads retrieved', data: result });
};

// 3. Get Single Ad (Private/Admin use)
const getSingleAd = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params; // Next.js 15 Await Fix
  const result = await ClassifiedAdServices.getSingleAdFromDB(id);
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ad retrieved', data: result });
};

// 4. Update Ad (Protected)
const updateAd = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  
  // 🔒 Verify User (Token থেকে ID নেওয়া হচ্ছে, Header থেকে নয়)
  const userId = getUserIdFromToken(req);

  const { id } = await params; // Next.js 15 Await Fix
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

  const result = await ClassifiedAdServices.updateAdInDB(id, userId, payloadForService);

  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ad updated successfully', data: result });
};

// 5. Delete Ad (Protected)
const deleteAd = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();

  // 🔒 Verify User
  const userId = getUserIdFromToken(req);

  const { id } = await params; // Next.js 15 Await Fix

  await ClassifiedAdServices.deleteAdFromDB(id, userId);
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ad deleted successfully', data: null });
};

// 6. Get Public Ads (Active only)
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

// 7. Get Public Ad By ID
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

// 8. Get Ads By Category
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

// 9. Get Filters (Dynamic Facets)
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

// 10. Update Status (Admin/Moderator)
const updateAdStatus = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const { status } = await req.json();

  if (!['active', 'inactive', 'sold'].includes(status)) {
    throw new Error('Invalid status value.');
  }

  const result = await ClassifiedAdServices.updateAdStatusInDB(id, status);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ad status updated successfully!',
    data: result,
  });
};

// 11. Get All Ads For Admin
const getAllAdsForAdmin = async (_req: NextRequest) => {
  await dbConnect();
  const result = await ClassifiedAdServices.getAllAdsForAdminFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All ads for admin retrieved',
    data: result,
  });
};

// 12. Advanced Search
const searchAds = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const filters: Record<string, any> = {};
  
  // Helper to get array of params
  const getAll = (key: string) => searchParams.getAll(key);

  if (searchParams.get('category')) filters.category = searchParams.get('category');
  if (getAll('subCategory').length > 0) filters.subCategory = getAll('subCategory');
  if (getAll('brand').length > 0) filters.brand = getAll('brand');
  if (searchParams.get('division')) filters.division = searchParams.get('division');
  // District can be multiple in URL but currently logic supports one, safe to use first or array handled in service
  if (getAll('district').length > 0) filters.district = getAll('district')[0]; 
  if (searchParams.get('upazila')) filters.upazila = searchParams.get('upazila');
  if (searchParams.get('minPrice')) filters.minPrice = searchParams.get('minPrice');
  if (searchParams.get('maxPrice')) filters.maxPrice = searchParams.get('maxPrice');
  if (searchParams.get('title')) filters.title = searchParams.get('title');

  const result = await ClassifiedAdServices.searchAdsInDB(filters);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ads retrieved based on search criteria',
    data: result,
  });
};

// ==========================================
// 📤 EXPORT
// ==========================================
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
  updateAdStatus,
  getAllAdsForAdmin,
  searchAds,
};