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

// ==========================================
// 🔐 HELPER: Secure User ID & Role Extraction
// ==========================================
const getUserDetailsFromToken = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Authorization token missing or invalid.');
  }
  const token = authHeader.split(' ')[1];
  // Token verify করে userId এবং role বের করা হচ্ছে
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as { userId: string; role: string };
  return { userId: decoded.userId, role: decoded.role };
};

// ==========================================
// 🚀 CONTROLLERS
// ==========================================

// 1. Create Ad
const createAd = async (req: NextRequest) => {
  await dbConnect();

  const { userId } = getUserDetailsFromToken(req);

  const formData = await req.formData();
  const images = formData.getAll('images') as File[];

  if (!images.length) throw new Error('At least one image is required.');

  const uploadResults = await Promise.all(
    images.map(async file => uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'classified-ads'))
  );
  const imageUrls = uploadResults.map(r => r.secure_url);

  const payload: any = { images: imageUrls, user: userId };

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

  if (payload.price) payload.price = Number(payload.price);
  if (payload.isNegotiable) payload.isNegotiable = payload.isNegotiable === 'true';

  const validatedData = createAdValidationSchema.parse(payload);

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
    // Default status is 'pending' from model
  };

  const result = await ClassifiedAdServices.createAdInDB(payloadForService);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Ad posted successfully!',
    data: result,
  });
};

// 2. Get All Ads
const getAllAds = async (_req: NextRequest) => {
  await dbConnect();
  const result = await ClassifiedAdServices.searchAdsInDB({});
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ads retrieved', data: result });
};

// 3. Get Single Ad
const getSingleAd = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const result = await ClassifiedAdServices.getSingleAdFromDB(id);
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ad retrieved', data: result });
};

// 4. Update Ad (Content Update -> Owner Only)
const updateAd = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  
  const { userId, role } = getUserDetailsFromToken(req);

  const { id } = await params;
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

  // Service-এ ৪টি আর্গুমেন্ট পাঠানো হচ্ছে
  const result = await ClassifiedAdServices.updateAdInDB(id, userId, role, payloadForService);

  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ad updated successfully', data: result });
};

// 5. Delete Ad (Owner OR Admin)
const deleteAd = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();

  const { userId, role } = getUserDetailsFromToken(req);
  
  const { id } = await params;

  await ClassifiedAdServices.deleteAdFromDB(id, userId, role);
  
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ad deleted successfully', data: null });
};

// 6. Get Public Ads
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

// 9. Get Filters
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

// 10. Update Status (Admin Only)
const updateAdStatus = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();

  // ✅ ADMIN SECURITY CHECK
  const { role } = getUserDetailsFromToken(req);
  if (role !== 'admin') {
    throw new Error('Forbidden: Only admins can update ad status.');
  }

  const { id } = await params;
  const { status } = await req.json();

  if (!['pending', 'active', 'inactive', 'sold'].includes(status)) {
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
  // Optional: Admin check here too if needed
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
  const getAll = (key: string) => searchParams.getAll(key);

  if (searchParams.get('category')) filters.category = searchParams.get('category');
  if (getAll('subCategory').length > 0) filters.subCategory = getAll('subCategory');
  if (getAll('brand').length > 0) filters.brand = getAll('brand');
  if (searchParams.get('division')) filters.division = searchParams.get('division');
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