import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { ServiceServices } from './provideService.service';
import {
  createServiceValidationSchema,
  updateServiceValidationSchema,
} from './provideService.validation';
import { verifyToken } from '@/lib/utils/jwt';
import dbConnect from '@/lib/db';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import mongoose from 'mongoose';

const getUserDetailsFromToken = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Authorization token missing or invalid.');
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as {
    userId: string;
    role: string;
    profilePicture: string;
  };
  return { userId: decoded.userId, role: decoded.role };
};

const createService = async (req: NextRequest) => {
  await dbConnect();
  const { userId } = getUserDetailsFromToken(req);
  const formData = await req.formData();

  // Image handling
  const images = formData.getAll('service_images') as File[];
  let imageUrls: string[] = [];
  if (images.length > 0 && images[0] instanceof File) {
    const uploadResults = await Promise.all(
      images.map(async (file) =>
        uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'service-images')
      )
    );
    imageUrls = uploadResults.map((r) => r.secure_url);
  }

  const payload: any = {
    provider_id: userId,
    service_images: imageUrls,
  };

  const allKeys = Array.from(new Set(formData.keys()));

  for (const key of allKeys) {
    if (key === 'service_images') continue;

    const values = formData.getAll(key);

    if (key.includes('.')) {
      const [parentKey, childKey] = key.split('.');
      if (!payload[parentKey]) payload[parentKey] = {};
      payload[parentKey][childKey] = values[0];
    } else if (key === 'available_time_slots' || key === 'working_days') {
      payload[key] = values;
    } else {
      payload[key] = values[0];
    }
  }

  const validatedData = createServiceValidationSchema.parse(payload);

  const result = await ServiceServices.createServiceInDB({
    ...validatedData,
    provider_id: new mongoose.Types.ObjectId(validatedData.provider_id) as any,
  });

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Service created successfully!',
    data: result,
  });
};

const getProviderServices = async (
  req: NextRequest,
  { params }: { params: Promise<{ provider_id: string }> }
) => {
  await dbConnect();
  const { provider_id } = await params;
  const result = await ServiceServices.getProviderServicesFromDB(provider_id);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Provider services retrieved successfully!',
    data: result,
  });
};

const getServiceById = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const service = await ServiceServices.getServiceByIdFromDB(id);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service retrieved successfully!',
    data: service,
  });
};

const updateService = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateServiceValidationSchema.parse(body);
  const result = await ServiceServices.updateServiceInDB(id, validatedData);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service updated successfully!',
    data: result,
  });
};

const deleteService = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const result = await ServiceServices.deleteServiceInDB(id, '');
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service deleted successfully!',
    data: result,
  });
};

const getAllServices = async () => {
  await dbConnect();
  const result = await ServiceServices.getAllServicesFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All services retrieved successfully!',
    data: result,
  });
};

const changeServiceStatus = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const { action } = await req.json();

  let status: 'Active' | 'Disabled';
  let is_visible_to_customers: boolean;

  if (action === 'approve') {
    status = 'Active';
    is_visible_to_customers = true;
  } else if (action === 'reject') {
    status = 'Disabled';
    is_visible_to_customers = false;
  } else {
    throw new Error('Invalid action');
  }

  const result = await ServiceServices.changeServiceStatusInDB(
    id,
    status,
    is_visible_to_customers
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service status updated successfully!',
    data: result,
  });
};

const getVisibleServices = async () => {
  await dbConnect();
  const result = await ServiceServices.getVisibleServicesFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Visible services retrieved successfully!',
    data: result,
  });
};

export const ServiceController = {
  createService,
  getProviderServices,
  updateService,
  deleteService,
  getServiceById,
  getAllServices,
  changeServiceStatus,
  getVisibleServices,
};