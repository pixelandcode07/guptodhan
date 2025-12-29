import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import {
  createServiceBannerValidationSchema,
  updateServiceBannerValidationSchema,
} from './serviceBanner.validation';
import { ServiceBannerServices } from './serviceBanner.service';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import dbConnect from '@/lib/db';

// convert File to Buffer
const fileToBuffer = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

// Create service banner
const createServiceBanner = async (req: NextRequest) => {
  await dbConnect();

  try {
    const formData = await req.formData();

    const bannerTitle = formData.get('bannerTitle') as string;
    const subTitle = formData.get('subTitle') as string;
    const bannerDescription = formData.get('bannerDescription') as string;
    const bannerLink = formData.get('bannerLink') as string;
    const status = formData.get('status') as 'active' | 'inactive';
    const bannerFile = formData.get('bannerImage') as File | null;

    createServiceBannerValidationSchema.parse({
      bannerTitle,
      bannerImage: bannerFile ? 'dummy' : '',
      status,
    });

    let bannerImageUrl = '';
    if (bannerFile) {
      const buffer = await fileToBuffer(bannerFile);
      const uploaded = await uploadToCloudinary(buffer, 'service-banners');
      bannerImageUrl = uploaded.secure_url;
    }

    const payload = {
      bannerTitle,
      subTitle,
      bannerDescription,
      bannerLink,
      bannerImage: bannerImageUrl,
      status,
    };

    const result = await ServiceBannerServices.createServiceBannerInDB(payload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Service banner created successfully!',
      data: result,
    });
  } catch (error) {
    console.error('Create service banner error:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to create service banner',
      data: null,
    });
  }
};

// Get all banners (Admin)
const getAllServiceBanners = async () => {
  await dbConnect();

  const result = await ServiceBannerServices.getAllServiceBannersFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service banners retrieved successfully!',
    data: result,
  });
};

// Get only active banners (Public)
const getActiveServiceBanners = async () => {
  await dbConnect();

  const result = await ServiceBannerServices.getActiveServiceBannersFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Active service banners retrieved successfully!',
    data: result,
  });
};

// Get banner by ID
const getServiceBannerById = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;

  const result = await ServiceBannerServices.getServiceBannerByIdFromDB(id);

  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Service banner not found',
      data: null,
    });
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service banner retrieved successfully!',
    data: result,
  });
};

// Update service banner
const updateServiceBanner = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const formData = await req.formData();

  const bannerTitle = formData.get('bannerTitle') as string;
  const subTitle = formData.get('subTitle') as string;
  const bannerDescription = formData.get('bannerDescription') as string;
  const bannerLink = formData.get('bannerLink') as string;
  const status = formData.get('status') as 'active' | 'inactive';
  const bannerFile = formData.get('bannerImage') as File | null;

  updateServiceBannerValidationSchema.parse({
    bannerTitle,
    status,
    bannerImage: bannerFile ? 'dummy' : undefined,
  });

  const payload: any = {};

  if (bannerTitle) payload.bannerTitle = bannerTitle;
  if (subTitle) payload.subTitle = subTitle;
  if (bannerDescription) payload.bannerDescription = bannerDescription;
  if (bannerLink) payload.bannerLink = bannerLink;
  if (status) payload.status = status;

  if (bannerFile) {
    const buffer = await fileToBuffer(bannerFile);
    const uploaded = await uploadToCloudinary(buffer, 'service-banners');
    payload.bannerImage = uploaded.secure_url;
  }

  const result = await ServiceBannerServices.updateServiceBannerInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service banner updated successfully!',
    data: result,
  });
};

// Delete service banner
const deleteServiceBanner = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;

  await ServiceBannerServices.deleteServiceBannerFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service banner deleted successfully!',
    data: null,
  });
};

export const ServiceBannerController = {
  createServiceBanner,
  getAllServiceBanners,
  getActiveServiceBanners,
  getServiceBannerById,
  updateServiceBanner,
  deleteServiceBanner,
};
