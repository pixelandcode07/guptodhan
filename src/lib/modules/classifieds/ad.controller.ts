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
  console.log("=== CREATE AD START ===");
  console.log("Auth header:", authHeader);
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Authorization token missing.');
  const token = authHeader.split(' ')[1];
  console.log("Token:", token);

  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
  console.log("Decoded:", decoded);
  const userId = decoded.userId as string;

  // 2️⃣ FormData & images
  const formData = await req.formData();
  const images = formData.getAll('images') as File[];
  console.log("Images:", images);
  console.log("Images length:", images.length);
  console.log("First image:", images[0]);
  console.log("First image type:", images[0]?.constructor?.name);
  if (!images.length) throw new Error('At least one image is required.');

  const uploadResults = await Promise.all(
    images.map(async file => uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'classified-ads'))
  );
  console.log("Upload results:", uploadResults);

  const imageUrls = uploadResults.map(r => r.secure_url);
  console.log("Image URLs:", imageUrls);

  // 3️⃣ Payload mapping
  const payload: any = { images: imageUrls, user: userId, };
  console.log("Payload before validation:", payload);
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
  console.log("Payload before validation:", payload);

  // Validation
  const validatedData = createAdValidationSchema.parse(payload);
  console.log("Validated data:", validatedData);

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
    // status এখানে উল্লেখ করার দরকার নেই, Model এর default 'pending' কাজ করবে।
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

const updateAdStatus = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
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


// const searchAds = async (req: NextRequest) => {
//   await dbConnect();
//   const { searchParams } = new URL(req.url);

//   const filters: Record<string, any> = {};

//   // URL থেকে সব ফিল্টার সংগ্রহ করা হচ্ছে
//   if (searchParams.get('category')) filters.category = searchParams.get('category');
//   if (searchParams.get('subCategory')) filters.subCategory = searchParams.get('subCategory');
//   if (searchParams.get('brand')) filters.brand = searchParams.get('brand');
//   if (searchParams.get('division')) filters.division = searchParams.get('division');
//   if (searchParams.get('district')) filters.district = searchParams.get('district');
//   if (searchParams.get('upazila')) filters.upazila = searchParams.get('upazila');
//   if (searchParams.get('minPrice')) filters.minPrice = searchParams.get('minPrice');
//   if (searchParams.get('maxPrice')) filters.maxPrice = searchParams.get('maxPrice');

//   // ✅ searchAdsInDB সার্ভিস ফাংশনটিকে ফিল্টারসহ কল করা হচ্ছে
//   const result = await ClassifiedAdServices.searchAdsInDB(filters);

//   return sendResponse({
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'Ads retrieved based on search criteria',
//     data: result
//   });
// };

// src/lib/modules/classifieds/ad.controller.ts

const searchAds = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const filters: Record<string, any> = {};

  // একাধিক মান সাপোর্ট (subCategory=Phone&subCategory=Accessories)
  const getAll = (key: string) => searchParams.getAll(key);

  if (searchParams.get('category')) filters.category = searchParams.get('category');
  if (getAll('subCategory').length > 0) filters.subCategory = getAll('subCategory');
  if (getAll('brand').length > 0) filters.brand = getAll('brand');
  if (searchParams.get('division')) filters.division = searchParams.get('division');
  if (getAll('district').length > 0) filters.district = getAll('district')[0]; // প্রথমটা নাও
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
