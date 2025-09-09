// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-provider\serviceProvider.controller.ts
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { ServiceProviderServices } from './serviceProvider.service';
import { registerServiceProviderSchema } from './serviceProvider.validation';
import dbConnect from '@/lib/db';

const registerServiceProvider = async (req: NextRequest) => {
  await dbConnect();
  const formData = await req.formData();
  
  const cvFile = formData.get('cv') as File | null;
  const profilePictureFile = formData.get('profilePicture') as File | null;
  
  const payload: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (key !== 'cv' && key !== 'profilePicture') {
      payload[key] = value;
    }
  }

  // ফাইলগুলো Cloudinary-তে আপলোড করা হচ্ছে
  if (cvFile) {
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'service-provider-cvs');
    payload.cvUrl = uploadResult.secure_url;
  }
  if (profilePictureFile) {
    const buffer = Buffer.from(await profilePictureFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'profile-pictures');
    payload.profilePicture = uploadResult.secure_url;
  }
  
  const validatedData = registerServiceProviderSchema.parse(payload);
  const result = await ServiceProviderServices.registerServiceProviderInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Service provider registered successfully!',
    data: result,
  });
};

export const ServiceProviderController = {
  registerServiceProvider,
};