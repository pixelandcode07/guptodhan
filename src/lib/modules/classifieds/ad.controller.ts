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
    status: 'pending' // ✅ ডিফল্ট ভাবে pending থাকবে
  };

  const result = await ClassifiedAdServices.createAdInDB(payloadForService);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Ad posted successfully! Waiting for admin approval.',
    data: result,
  });
};

// 2. Get All Ads (For generic search/listing)
const getAllAds = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const isMyAdsRequest = searchParams.get('user') === 'true';

  let result;
  if (isMyAdsRequest) {
    // ✅ যদি ইউজারের নিজের অ্যাড হয়, তাহলে active, pending সবই আনবে
    try {
      const { userId } = getUserDetailsFromToken(req);
      result = await ClassifiedAdServices.searchAdsInDB({ user: userId }, { onlyActive: false });
    } catch (e) {
      throw new Error('Unauthorized to view my ads');
    }
  } else {
    // ✅ Admin-er valid token thakle (admin panel theke call) shob status-er ad dekhabe.
    // Token na thakle, invalid hole, ba role admin na hole — age-er moto shudhu active (public listing).
    let isAdminRequest = false;
    try {
      const { role } = getUserDetailsFromToken(req);
      isAdminRequest = role === 'admin';
    } catch {
      // no-op: public/anonymous request, isAdminRequest stays false
    }

    result = await ClassifiedAdServices.searchAdsInDB({}, { onlyActive: !isAdminRequest });
  }

  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ads retrieved', data: result });
};

// 3. Get Single Ad
const getSingleAd = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const result = await ClassifiedAdServices.getSingleAdFromDB(id);

  // Security Check: If ad is not active, only owner or admin can view it
  if (result && result.status !== 'active') {
    try {
      const { userId, role } = getUserDetailsFromToken(req);
      const isOwner = result.user._id.toString() === userId;
      const isAdmin = role === 'admin';
      
      if (!isOwner && !isAdmin) {
         throw new Error('Ad is pending approval or inactive.');
      }
    } catch (error) {
      throw new Error('Ad is not currently active.');
    }
  }

  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Ad retrieved', data: result });
};

// 4. Update Ad
// 4. Update Ad (Content Update -> Owner Only)
const updateAd = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  
  const { userId, role } = getUserDetailsFromToken(req);
  const { id } = await params;

  // ✅ JSON এর বদলে FormData রিসিভ করা হচ্ছে (কারন ছবি থাকতে পারে)
  const formData = await req.formData();
  const payload: any = {};

  // Text Fields Extract
  const simpleFields = [
    'title', 'division', 'district', 'upazila', 
    'condition', 'authenticity', 'brand', 'productModel', 
    'edition', 'description'
  ];

  simpleFields.forEach(field => {
    if (formData.has(field)) payload[field] = formData.get(field);
  });

  if (formData.has('price')) payload.price = Number(formData.get('price'));
  if (formData.has('isNegotiable')) payload.isNegotiable = formData.get('isNegotiable') === 'true';

  // Object IDs (Category & Subcategory)
  if (formData.has('category')) payload.category = new Types.ObjectId(formData.get('category') as string);
  if (formData.has('subCategory')) payload.subCategory = new Types.ObjectId(formData.get('subCategory') as string);

  // Arrays (Features)
  const features = formData.getAll('features');
  if (features.length > 0) payload.features = features;

  // Contact Details Extract
  if (formData.has('contactName') || formData.has('contactPhone')) {
    payload.contactDetails = {
      name: formData.get('contactName') as string || '',
      phone: formData.get('contactPhone') as string || '',
      email: formData.get('contactEmail') as string || undefined,
      isPhoneHidden: formData.get('isPhoneHidden') === 'true',
    };
  }

  // ✅ Image Handling (Existing + New)
  const existingImages = formData.getAll('existingImages') as string[];
  const newImageFiles = formData.getAll('newImages') as File[];

  let finalImages = [...existingImages];

  // যদি নতুন ছবি আপলোড করে থাকে, সেগুলো ক্লাউডিনারিতে আপলোড করে লিংকে কনভার্ট করুন
  if (newImageFiles.length > 0) {
    const uploadResults = await Promise.all(
      newImageFiles.map(async file => uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'classified-ads'))
    );
    const newImageUrls = uploadResults.map(r => r.secure_url);
    finalImages = [...finalImages, ...newImageUrls];
  }

  if (finalImages.length > 0) {
    payload.images = finalImages;
  }

  // ✅ Zod Validation (Optional: Call your update validation schema here if needed)
  // const validatedData = updateAdValidationSchema.parse(payload);

  // Send to Service
  const result = await ClassifiedAdServices.updateAdInDB(id, userId, role, payload);

  return sendResponse({ 
    success: true, 
    statusCode: StatusCodes.OK, 
    message: 'Ad updated successfully. Waiting for admin approval.', 
    data: result 
  });
};

// 5. Delete Ad
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
  
  if(result.status !== 'active'){
     throw new Error("This ad is no longer active");
  }

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
    message: `Ad marked as ${status} successfully!`,
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

  // ✅ পাবলিক সার্চের ক্ষেত্রে onlyActive: true দিয়ে ফিল্টার করবে
  const result = await ClassifiedAdServices.searchAdsInDB(filters, { onlyActive: true });

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ads retrieved based on search criteria',
    data: result,
  });
};

// 13. ✅ NEW: Get User's Own Ads
const getMyAds = async (req: NextRequest) => {
  await dbConnect();
  try {
    const { userId } = getUserDetailsFromToken(req);
    const result = await ClassifiedAdServices.getMyAdsFromDB(userId);
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Your ads retrieved successfully',
      data: result,
    });
  } catch (error: any) {
     return sendResponse({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Unauthorized access',
      data: null,
    });
  }
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
  getMyAds,
};