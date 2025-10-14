// src/lib/modules/about-cta/cta.controller.ts
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import {
  createCtaValidationSchema,
  updateCtaValidationSchema,
} from './cta.validation';
import { AboutCtaServices } from './cta.service';
import dbConnect from '@/lib/db';
import { IAboutCta } from './cta.interface';

// CREATE CTA
const createCta = async (req: NextRequest) => {
  await dbConnect();

  const formData = await req.formData();
  const imageFile = formData.get('ctaImage') as File | null;

  if (!imageFile) {
    throw new Error('CTA image is required.');
  }

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const uploadResult = await uploadToCloudinary(buffer, 'about-section');

  const payload = {
    ctaImage: uploadResult.secure_url,
    ctaTitle: (formData.get('ctaTitle') as string) || '',
    ctaLink: (formData.get('ctaLink') as string) || '',
    ctaButtonText: (formData.get('ctaButtonText') as string) || '',
    ctaDescription: (formData.get('ctaDescription') as string) || undefined,
    isActive: (formData.get('isActive') as string) === 'true' || true,
  };

  const validatedData = createCtaValidationSchema.parse(payload);
  const result = await AboutCtaServices.createCtaInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'CTA created successfully!',
    data: result,
  });
};

// PUBLIC CTA GET
const getPublicCta = async (_req: NextRequest) => {
  await dbConnect();
  const result = await AboutCtaServices.getPublicCtaFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'CTA retrieved successfully!',
    data: result,
  });
};

// UPDATE CTA
const updateCta = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();

  const { id } = await params;
  const formData = await req.formData();

  const payload: Partial<IAboutCta> = {};

  // Extract fields
  const ctaTitle = formData.get('ctaTitle') as string | null;
  const ctaLink = formData.get('ctaLink') as string | null;
  const ctaButtonText = formData.get('ctaButtonText') as string | null;
  const ctaDescription = formData.get('ctaDescription') as string | null;
  const isActive = formData.get('isActive') as string | null;

  if (ctaTitle) payload.ctaTitle = ctaTitle;
  if (ctaLink) payload.ctaLink = ctaLink;
  if (ctaButtonText) payload.ctaButtonText = ctaButtonText;
  if (ctaDescription) payload.ctaDescription = ctaDescription;
  if (isActive !== null) payload.isActive = isActive === 'true';

  // Optional image file
  const imageFile = formData.get('ctaImage') as File | null;
  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'about-section');
    payload.ctaImage = uploadResult.secure_url;
    console.log('✅ New image uploaded:', payload.ctaImage);
  } else {
    console.log('ℹ️ No new image uploaded.');
  }

  // Validate using update schema (ctaImage is allowed now)
  const validatedData = updateCtaValidationSchema.partial().parse(payload);

  const result = await AboutCtaServices.updateCtaInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'CTA updated successfully!',
    data: result,
  });
};

export const AboutCtaController = {
  createCta,
  getPublicCta,
  updateCta,
};
