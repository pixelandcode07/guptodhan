// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service\service.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createServiceSchema, updateServiceSchema } from './service.validation';
import { ServiceServices } from './service.service';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';
import { Types } from 'mongoose';

const createService = async (req: NextRequest) => {
    await dbConnect();
    const authHeader = req.headers.get('authorization');
    if (!authHeader) { throw new Error('Authorization token is missing.'); }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
    // এখানে আমরা provider-এর ID নেব, সাধারণ user ID নয়
    // ServiceProvider মডেল থেকে User ID দিয়ে provider ID খুঁজে বের করতে হবে
    // আপাতত, আমরা ধরে নিচ্ছি decoded.userId হলো providerId
    const providerId = decoded.userId as string; 

    const formData = await req.formData();
    const images = formData.getAll('images') as File[];
    if (!images.length) { throw new Error('At least one image is required.'); }

    const uploadPromises = images.map(file => uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'services'));
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map(r => r.secure_url);

    const payload = {
        provider: providerId,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        category: formData.get('category') as string,
        location: JSON.parse(formData.get('location') as string), // location-কে JSON string হিসেবে পাঠাতে হবে
        images: imageUrls,
    };
    
    const validatedData = createServiceSchema.parse(payload);
    const result = await ServiceServices.createServiceInDB(validatedData as any);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Service listed successfully!', data: result });
};

const getMyServices = async (req: NextRequest) => {
    await dbConnect();
    const providerId = req.headers.get('x-user-id'); // Assuming middleware passes provider's user ID
    if (!providerId) { throw new Error("Provider not authenticated."); }
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

export const ServiceController = {
  createService,
  getMyServices,
  searchPublicServices,
};