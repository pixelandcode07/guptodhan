import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createStoreValidationSchema, updateStoreValidationSchema } from './vendorStore.validation';
import { StoreServices } from './vendorStore.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { deleteFromCloudinary, uploadToCloudinary } from '@/lib/utils/cloudinary';
import { StoreModel } from './vendorStore.model';

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
  const { id } = await params;
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

  const formData = await req.formData();

  // Fetch existing store
  const existingStore = await StoreModel.findById(id);
  if (!existingStore) {
    return sendResponse({
      success: false,
      statusCode: 404,
      message: "Store not found",
    });
  }

  let storeLogo = existingStore.storeLogo;
  let storeBanner = existingStore.storeBanner;

  // ----------- HANDLE NEW LOGO UPLOAD -----------
  const logoFile = formData.get('logo') as File | null;
  if (logoFile instanceof File) {
    const buffer = Buffer.from(await logoFile.arrayBuffer());

    // delete old
    if (existingStore.storeLogo) {
      await deleteFromCloudinary(existingStore.storeLogo);
    }

    const result = await uploadToCloudinary(buffer, 'stores/logo');
    storeLogo = result.secure_url;
  }

  // ----------- HANDLE NEW BANNER UPLOAD -----------
  const bannerFile = formData.get('banner') as File | null;
  if (bannerFile instanceof File) {
    const buffer = Buffer.from(await bannerFile.arrayBuffer());

    // delete old
    if (existingStore.storeBanner) {
      await deleteFromCloudinary(existingStore.storeBanner);
    }

    const result = await uploadToCloudinary(buffer, 'stores/banner');
    storeBanner = result.secure_url;
  }


  const payload: any = {
    storeLogo,
    storeBanner,

    storeName: formData.get("storeName") || existingStore.storeName,
    storeAddress: formData.get("storeAddress") || existingStore.storeAddress,
    storePhone: formData.get("storePhone") || existingStore.storePhone,
    storeEmail: formData.get("storeEmail") || existingStore.storeEmail,
    vendorShortDescription:
      formData.get("vendorShortDescription") || existingStore.vendorShortDescription,
    fullDescription: formData.get("fullDescription") || existingStore.fullDescription,
    commission: formData.get("commission")
      ? Number(formData.get("commission"))
      : existingStore.commission,

    // 🔥 Correct – array from JSON
    storeMetaTitle: (() => {
      const raw = formData.get("storeMetaTitle");
      if (!raw) return existingStore.storeMetaTitle;

      try {
        const parsed = JSON.parse(raw as string);
        return Array.isArray(parsed) ? parsed : existingStore.storeMetaTitle;
      } catch {
        return existingStore.storeMetaTitle;
      }
    })(),

    storeMetaKeywords: (() => {
      const raw = formData.get("storeMetaKeywords");
      if (!raw) return existingStore.storeMetaKeywords;

      try {
        const parsed = JSON.parse(raw as string);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return existingStore.storeMetaKeywords;
      }
    })(),

    storeMetaDescription:
      formData.get("storeMetaDescription") || existingStore.storeMetaDescription,
  };


  // ----------- SOCIAL LINKS -----------
  payload.storeSocialLinks = {
    facebook: formData.get('storeSocialLinks[facebook]') as string | null,
    whatsapp: formData.get('storeSocialLinks[whatsapp]') as string | null,
    instagram: formData.get('storeSocialLinks[instagram]') as string | null,
    linkedIn: formData.get('storeSocialLinks[linkedIn]') as string | null,
    twitter: formData.get('storeSocialLinks[twitter]') as string | null,
    tiktok: formData.get('storeSocialLinks[tiktok]') as string | null,
  };

  // REMOVE undefined keys
  Object.keys(payload).forEach(
    (key) => payload[key] === undefined && delete payload[key]
  );

  try {
    const updatedStore = await StoreModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return sendResponse({
      success: true,
      statusCode: 200,
      message: "Store updated successfully!",
      data: updatedStore,
    });
  } catch (error: any) {
    return sendResponse({
      success: false,
      statusCode: 500,
      message: error.message || "Failed to update store",
    });
  }
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
