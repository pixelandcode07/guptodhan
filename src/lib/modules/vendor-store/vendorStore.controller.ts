import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createStoreValidationSchema, updateStoreValidationSchema } from './vendorStore.validation';
import { StoreServices } from './vendorStore.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

const createStore = async (req: NextRequest) => {
  await dbConnect();
  const formData = await req.formData();

  const logoFile = formData.get('logo') as File | null;
  const bannerFile = formData.get('banner') as File | null;

  let storeLogo = '';
  let storeBanner = '';

  if (logoFile) {
    const buffer = Buffer.from(await logoFile.arrayBuffer());
    const result = await uploadToCloudinary(buffer, 'stores/logo');
    storeLogo = result.secure_url;
  }

  if (bannerFile) {
    const buffer = Buffer.from(await bannerFile.arrayBuffer());
    const result = await uploadToCloudinary(buffer, 'stores/banner');
    storeBanner = result.secure_url;
  }

  if (!storeLogo || !storeBanner) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Logo and Banner are required.',
    });
  }

  const payload: any = {
    vendorId: formData.get('vendorId') as string,

    storeLogo,
    storeBanner,
    storeName: formData.get('storeName') as string,
    storeAddress: formData.get('storeAddress') as string,
    storePhone: formData.get('storePhone') as string,
    storeEmail: formData.get('storeEmail') as string,
    vendorShortDescription: formData.get('vendorShortDescription') as string,
    fullDescription: formData.get('fullDescription') as string,
    commission: formData.get('commission') ? Number(formData.get('commission')) : 0,
    storeMetaTitle: (formData.get('storeMetaTitle') as string) || undefined,

    // SAFELY PARSE KEYWORDS
    storeMetaKeywords: (() => {
      const raw = formData.get('storeMetaKeywords');
      if (!raw || raw === 'null' || raw === 'undefined') return [];
      try {
        const parsed = JSON.parse(raw as string);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.warn('Failed to parse storeMetaKeywords, using empty array');
        return [];
      }
    })(),

    storeMetaDescription: (formData.get('storeMetaDescription') as string) || undefined,

    storeSocialLinks: {
      facebook: formData.get('storeSocialLinks[facebook]') as string | null,
      whatsapp: formData.get('storeSocialLinks[whatsapp]') as string | null,
      instagram: formData.get('storeSocialLinks[instagram]') as string | null,
      linkedIn: formData.get('storeSocialLinks[linkedIn]') as string | null,
      twitter: formData.get('storeSocialLinks[twitter]') as string | null,
      tiktok: formData.get('storeSocialLinks[tiktok]') as string | null,
    },
  };

  // NOW SAFE VALIDATION
  let validatedData;
  try {
    validatedData = createStoreValidationSchema.parse(payload);
  } catch (error: any) {
    console.error('Zod Validation Failed:', error.errors);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Validation failed',
      data: error.errors,
    });
  }

  // Convert vendorId to ObjectId AFTER validation
  const finalPayload = {
    ...validatedData,
    vendorId: new Types.ObjectId(validatedData.vendorId),
  };

  try {
    const result = await StoreServices.createStoreInDB(finalPayload);
    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Store created successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('DB Error:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create store',
    });
  }
};








const getAllStores = async () => {
  await dbConnect();
  const result = await StoreServices.getAllStoresFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Stores retrieved successfully!',
    data: result,
  });
};

// Get store by ID
const getStoreById = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const result = await StoreServices.getStoreByIdFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Store retrieved successfully!',
    data: result,
  });
};


// Get store by Vendor ID
const getStoreByVendorId = async (
  _req: NextRequest,
  { params }: { params: { vendorId: string } }
) => {
  await dbConnect();

  const { vendorId } = await params;

  const result = await StoreServices.getStoreByVendorIdFromDB(vendorId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Store retrieved successfully by vendorId!',
    data: result,
  });
};


// Update store
const updateStore = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateStoreValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    vendorId: new Types.ObjectId(validatedData.vendorId)
  };

  const result = await StoreServices.updateStoreInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Store updated successfully!',
    data: result,
  });
};

// Delete store
const deleteStore = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = await params;
  await StoreServices.deleteStoreFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Store deleted successfully!',
    data: null,
  });
};

export const VendorStoreController = {
  createStore,
  getAllStores,
  getStoreById,
  getStoreByVendorId,
  updateStore,
  deleteStore,
};
