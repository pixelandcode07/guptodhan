/* eslint-disable @typescript-eslint/no-unused-vars */
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\social-link\socialLink.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import {
  createSocialLinkSchema,
  updateSocialLinkSchema,
} from './socialLink.validation';
import { SocialLinkServices } from './socialLink.service';
import dbConnect from '@/lib/db';

const createSocialLink = async (req: NextRequest) => {
  await dbConnect();
  const formData = await req.formData();
  const iconFile = formData.get('icon') as File | null;
  if (!iconFile) {
    throw new Error('Icon image is required.');
  }

  const buffer = Buffer.from(await iconFile.arrayBuffer());
  const uploadResult = await uploadToCloudinary(buffer, 'social-icons');

  const payload = {
    label: formData.get('label') as string,
    url: formData.get('url') as string,
    icon: uploadResult.secure_url,
  };

  const validatedData = createSocialLinkSchema.parse(payload);
  const result = await SocialLinkServices.createSocialLinkInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Social link added successfully!',
    data: result,
  });
};

const getPublicSocialLinks = async (_req: NextRequest) => {
  await dbConnect();
  const result = await SocialLinkServices.getPublicSocialLinksFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Social links retrieved successfully!',
    data: result,
  });
};

const updateSocialLink = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateSocialLinkSchema.parse(body);
  const result = await SocialLinkServices.updateSocialLinkInDB(
    id,
    validatedData
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Social link updated successfully!',
    data: result,
  });
};

const deleteSocialLink = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;
  await SocialLinkServices.deleteSocialLinkFromDB(id);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Social link deleted successfully!',
    data: null,
  });
};

const getSocialLinkById = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const result = await SocialLinkServices.getSocialLinkByIdFromDB(id);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Social link retrieved successfully!',
        data: result,
    });
};

export const SocialLinkController = {
  createSocialLink,
  getPublicSocialLinks,
  updateSocialLink,
  deleteSocialLink,
  getSocialLinkById,
};
