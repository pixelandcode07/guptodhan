// D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-provider\serviceProvider.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import dbConnect from '@/lib/db';
import { ServiceProviderServices } from './serviceProvider.service';

const getAllActiveServiceProviders = async (_req: NextRequest) => {
  await dbConnect();
  const result = await ServiceProviderServices.getAllActiveServiceProvidersFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All active service providers retrieved successfully!',
    data: result,
  });
};

const getServiceProviderProfile = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const result = await ServiceProviderServices.getServiceProviderProfileFromDB(params.id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service provider profile retrieved successfully!',
    data: result,
  });
};

export const ServiceProviderController = {
  getAllActiveServiceProviders,
  getServiceProviderProfile,
};
