/* eslint-disable @typescript-eslint/no-explicit-any */
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service\service.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createServiceSchema } from './service.validation';
import { ServiceServices } from './service.service';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';
import { Types } from 'mongoose';


const createService = async (req: NextRequest) => {
    await dbConnect();
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization token is missing.');
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
    const providerId = decoded.userId as string;

    const formData = await req.formData();
    const images = formData.getAll('images') as File[];
    if (!images.length) { throw new Error('At least one image is required.'); }

    const uploadPromises = images.map(async file => {
      const buffer = Buffer.from(await file.arrayBuffer());
      return uploadToCloudinary(buffer, 'services');
    });

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map(r => r.secure_url);

    const payload: Record<string, any> = {
        provider: new Types.ObjectId(providerId),
        title: formData.get('title'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        category: new Types.ObjectId(formData.get('category') as string),
        location: JSON.parse(formData.get('location') as string),
        images: imageUrls,
    };
    
    // ✅ FIX: subCategory যদি থাকে, তাহলে payload-এ যোগ করা হচ্ছে
    const subCategory = formData.get('subCategory') as string | null;
    if (subCategory) {
        payload.subCategory = new Types.ObjectId(subCategory);
    }
    
    const validatedData = createServiceSchema.parse(payload);
    const result = await ServiceServices.createServiceInDB(validatedData as any);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Service listed successfully!', data: result });
};


const getMyServices = async (req: NextRequest) => {
    await dbConnect();
    const authHeader = req.headers.get('authorization');
    if (!authHeader) { throw new Error('Authorization token is missing.'); }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
    const providerId = decoded.userId as string;

    const result = await ServiceServices.getServicesByProviderFromDB(providerId);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Your services retrieved.', data: result });
};

const searchPublicServices = async (req: NextRequest) => {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const filters: Record<string, any> = {};
    for (const [key, value] of searchParams.entries()) {
        filters[key] = value;
    }
    const result = await ServiceServices.searchPublicServicesFromDB(filters);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Services retrieved.', data: result });
};

// ... update and delete controllers would be here ...

export const ServiceController = {
  createService,
  getMyServices,
  searchPublicServices,
};