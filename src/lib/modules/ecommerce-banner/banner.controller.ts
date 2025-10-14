import { NextRequest } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createBannerSchema, updateBannerSchema } from './banner.validation';
import { EcommerceBannerServices } from './banner.service';
import dbConnect from '@/lib/db';
 
const createBanner = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();
    const imageFile = formData.get('bannerImage') as File | null;
    if (!imageFile) throw new Error('Banner image is required.');
    
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'ecommerce-banners');
    
    const payload: Record<string, any> = { bannerImage: uploadResult.secure_url };
    for(const [key, value] of formData.entries()) {
        if (key !== 'bannerImage') payload[key] = value;
    }

    const validatedData = createBannerSchema.parse(payload);
    const result = await EcommerceBannerServices.createBannerInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Banner created!', data: result });
};

const getAllBanners = async (_req: NextRequest) => {
    await dbConnect();
    const result = await EcommerceBannerServices.getAllBannersFromDB();
    // ✅ FIX: statusCode যোগ করা হয়েছে
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Banners retrieved!', data: result });
};

const getPublicBannersByPosition = async (req: NextRequest) => {
    await dbConnect();
    const position = req.nextUrl.searchParams.get('position');
    if (!position) throw new Error('Position query parameter is required.');
    const result = await EcommerceBannerServices.getPublicBannersByPositionFromDB(position);
    // ✅ FIX: statusCode যোগ করা হয়েছে
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Public banners retrieved!', data: result });
};

const updateBanner = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const formData = await req.formData();
    const payload: Record<string, any> = {};

    for(const [key, value] of formData.entries()) {
        if (key !== 'bannerImage' && value) payload[key] = value;
    }
    
    const imageFile = formData.get('bannerImage') as File | null;
    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'ecommerce-banners');
        payload.bannerImage = uploadResult.secure_url;
    }
    
    const validatedData = updateBannerSchema.parse(payload);
    const result = await EcommerceBannerServices.updateBannerInDB(id, validatedData);
    // ✅ FIX: statusCode যোগ করা হয়েছে
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Banner updated!', data: result });
};

const deleteBanner = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    await EcommerceBannerServices.deleteBannerInDB(id);
    // ✅ FIX: statusCode এবং data: null যোগ করা হয়েছে
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Banner deleted!', data: null });
};

export const EcommerceBannerController = {
  createBanner,
  getAllBanners,
  getPublicBannersByPosition,
  updateBanner,
  deleteBanner,
};