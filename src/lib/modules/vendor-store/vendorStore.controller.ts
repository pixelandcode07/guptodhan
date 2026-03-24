// src/lib/modules/vendor-store/vendorStore.controller.ts
// ✅ ABSOLUTELY FINAL: All type errors fixed + cleanSocialLinks working perfectly

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createStoreValidationSchema, updateStoreValidationSchema } from './vendorStore.validation';
import { StoreServices } from './vendorStore.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { deleteFromCloudinary, uploadToCloudinary } from '@/lib/utils/cloudinary';
import { StoreModel } from './vendorStore.model';
import { IStore } from './vendorStore.interface';

// ================================================================
// ✅ HELPER: Clean social links (Remove null/empty values)
// ================================================================

// Define the exact social links type
type SocialLinksType = {
  facebook?: string;
  whatsapp?: string;
  instagram?: string;
  linkedIn?: string;
  twitter?: string;
  tiktok?: string;
};

const cleanSocialLinks = (
  formData: FormData, 
  prefix: string = 'storeSocialLinks'
): SocialLinksType | undefined => {
  const links: SocialLinksType = {};
  let hasValue = false;

  const platforms = ['facebook', 'whatsapp', 'instagram', 'linkedIn', 'twitter', 'tiktok'] as const;

  platforms.forEach((platform) => {
    const value = formData.get(`${prefix}[${platform}]`);
    if (typeof value === 'string' && value.trim()) {
      links[platform] = value.trim();
      hasValue = true;
    }
  });

  return hasValue ? links : undefined;
};

// ================================================================
// ✅ HELPER: Validate and cast status
// ================================================================

const validateStatus = (value: any): "active" | "inactive" | undefined => {
  if (!value) return undefined;
  const status = String(value).toLowerCase().trim();
  if (status === 'active' || status === 'inactive') {
    return status as "active" | "inactive";
  }
  return undefined;
};

// ================================================================
// ✅ CREATE STORE
// ================================================================

const createStore = async (req: NextRequest) => {
  try {
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
        data: null,
      });
    }

    // ✅ Initial payload with string ID for validation
    const rawPayload: any = {
      vendorId: formData.get('vendorId') as string,
      storeLogo,
      storeBanner,
      storeName: formData.get('storeName') as string,
      storeAddress: formData.get('storeAddress') as string,
      storePhone: formData.get('storePhone') as string,
      storeEmail: formData.get('storeEmail') as string,
      vendorShortDescription: formData.get('vendorShortDescription') as string,
      fullDescription: formData.get('fullDescription') as string,
      commission: formData.get('commission') ? Number(formData.get('commission')) : undefined,
      storeMetaTitle: (formData.get('storeMetaTitle') as string) || undefined,

      storeMetaKeywords: (() => {
        const raw = formData.get('storeMetaKeywords');
        if (!raw || raw === 'null' || raw === 'undefined') return undefined;
        try {
          const parsed = JSON.parse(raw as string);
          return Array.isArray(parsed) ? parsed : undefined;
        } catch (e) {
          console.warn('Failed to parse storeMetaKeywords');
          return undefined;
        }
      })(),

      storeMetaDescription: (formData.get('storeMetaDescription') as string) || undefined,

      // ✅ FIXED: Using cleanSocialLinks helper correctly
      storeSocialLinks: cleanSocialLinks(formData),

      // Validate status
      status: validateStatus(formData.get('status')),
    };

    let validatedData;
    try {
      validatedData = createStoreValidationSchema.parse(rawPayload);
    } catch (error: any) {
      console.error('Zod Validation Failed:', error.errors);
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Validation failed',
        data: error.errors,
      });
    }

    // ✅ Final payload: Type Assertions Fixed
    const finalPayload: Partial<IStore> = {
      ...validatedData,
      vendorId: new Types.ObjectId(validatedData.vendorId),
      // Ensure social links match IStore type exactly
      storeSocialLinks: validatedData.storeSocialLinks as SocialLinksType | undefined
    };

    const result = await StoreServices.createStoreInDB(finalPayload);
    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Store created successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error creating store:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create store',
      data: null,
    });
  }
};

// ================================================================
// ✅ GET ALL STORES
// ================================================================

const getAllStores = async (req: NextRequest) => {
  try {
    await dbConnect();
    const result = await StoreServices.getAllStoresFromDB();

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Stores retrieved successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting all stores:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve stores',
      data: null,
    });
  }
};

// ================================================================
// ✅ GET STORE BY ID
// ================================================================

const getStoreById = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await dbConnect();
    const { id } = await params;

    if (!id || id.length !== 24) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid store ID format',
        data: null,
      });
    }

    const result = await StoreServices.getStoreByIdFromDB(id);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Store retrieved successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting store by id:', error);
    return sendResponse({
      success: false,
      statusCode: error.message?.includes('not found')
        ? StatusCodes.NOT_FOUND
        : StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve store',
      data: null,
    });
  }
};

// ================================================================
// ✅ GET STORE BY VENDOR ID
// ================================================================

const getStoreByVendorId = async (
  _req: NextRequest,
  { params }: { params: { vendorId: string } }
) => {
  try {
    await dbConnect();
    const { vendorId } = await params;

    if (!vendorId || vendorId.length !== 24) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid vendor ID format',
        data: null,
      });
    }

    const result = await StoreServices.getStoreByVendorIdFromDB(vendorId);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Store retrieved successfully by vendorId!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting store by vendor id:', error);
    return sendResponse({
      success: false,
      statusCode: error.message?.includes('not found')
        ? StatusCodes.NOT_FOUND
        : StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve store',
      data: null,
    });
  }
};

// ================================================================
// ✅ UPDATE STORE
// ================================================================

const updateStore = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await dbConnect();
    const { id } = await params;

    if (!id || id.length !== 24) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid store ID format',
        data: null,
      });
    }

    const formData = await req.formData();

    const existingStore = (await StoreModel.findById(id)
      .lean()) as unknown as IStore | null;

    if (!existingStore) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Store not found',
        data: null,
      });
    }

    let storeLogo = existingStore.storeLogo;
    let storeBanner = existingStore.storeBanner;

    const logoFile = formData.get('logo') as File | null;
    if (logoFile instanceof File) {
      try {
        const buffer = Buffer.from(await logoFile.arrayBuffer());
        if (existingStore.storeLogo) {
          await deleteFromCloudinary(existingStore.storeLogo);
        }
        const result = await uploadToCloudinary(buffer, 'stores/logo');
        storeLogo = result.secure_url;
      } catch (err) {
        console.error('Error uploading logo:', err);
        return sendResponse({
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Failed to upload logo',
          data: null,
        });
      }
    }

    const bannerFile = formData.get('banner') as File | null;
    if (bannerFile instanceof File) {
      try {
        const buffer = Buffer.from(await bannerFile.arrayBuffer());
        if (existingStore.storeBanner) {
          await deleteFromCloudinary(existingStore.storeBanner);
        }
        const result = await uploadToCloudinary(buffer, 'stores/banner');
        storeBanner = result.secure_url;
      } catch (err) {
        console.error('Error uploading banner:', err);
        return sendResponse({
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Failed to upload banner',
          data: null,
        });
      }
    }

    // ================================================================
    // ✅ PAYMENT INFO HANDLE
    // ================================================================
    const paymentInfoData: Record<string, string> = {};
    const piFields = ['bkash', 'nagad', 'rocket', 'bankName', 'bankAccount', 'bankBranch'];
    let hasPaymentInfo = false;

    piFields.forEach((field) => {
      const val = formData.get(`paymentInfo[${field}]`);
      if (val && typeof val === 'string' && val.trim()) {
        paymentInfoData[field] = val.trim();
        hasPaymentInfo = true;
      }
    });

    // ================================================================
    // ✅ BUILD PAYLOAD
    // ================================================================
    const payload: Partial<IStore> = {
      storeLogo,
      storeBanner,
      storeName: (formData.get('storeName') as string) || existingStore.storeName,
      storeAddress: (formData.get('storeAddress') as string) || existingStore.storeAddress,
      storePhone: (formData.get('storePhone') as string) || existingStore.storePhone,
      storeEmail: (formData.get('storeEmail') as string) || existingStore.storeEmail,
      status: validateStatus(formData.get('status')) || existingStore.status,
      vendorShortDescription:
        (formData.get('vendorShortDescription') as string) || existingStore.vendorShortDescription,
      fullDescription: (formData.get('fullDescription') as string) || existingStore.fullDescription,
      commission: formData.get('commission')
        ? Number(formData.get('commission'))
        : existingStore.commission,

      storeMetaTitle: (() => {
        const raw = formData.get('storeMetaTitle');
        if (!raw) return existingStore.storeMetaTitle;
        try {
          const parsed = JSON.parse(raw as string);
          return typeof parsed === 'string' ? parsed : existingStore.storeMetaTitle;
        } catch {
          return existingStore.storeMetaTitle;
        }
      })(),

      storeMetaKeywords: (() => {
        const raw = formData.get('storeMetaKeywords');
        if (!raw) return existingStore.storeMetaKeywords;
        try {
          const parsed = JSON.parse(raw as string);
          return Array.isArray(parsed) ? parsed : existingStore.storeMetaKeywords;
        } catch {
          return existingStore.storeMetaKeywords;
        }
      })(),

      storeMetaDescription:
        (formData.get('storeMetaDescription') as string) || existingStore.storeMetaDescription,

      storeSocialLinks: cleanSocialLinks(formData) || existingStore.storeSocialLinks,

      // ✅ paymentInfo: নতুন data থাকলে merge করো, না থাকলে পুরনোটা রাখো
      paymentInfo: hasPaymentInfo
        ? {
            ...existingStore.paymentInfo,
            ...paymentInfoData,
          }
        : existingStore.paymentInfo,
    };

    const updatedStore = await StoreServices.updateStoreInDB(id, payload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Store updated successfully!',
      data: updatedStore,
    });
  } catch (error: any) {
    console.error('Error updating store:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to update store',
      data: null,
    });
  }
};

// ================================================================
// ✅ DELETE STORE
// ================================================================

const deleteStore = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await dbConnect();
    const { id } = await params;

    if (!id || id.length !== 24) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid store ID format',
        data: null,
      });
    }

    await StoreServices.deleteStoreFromDB(id);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Store deleted successfully!',
      data: null,
    });
  } catch (error: any) {
    console.error('Error deleting store:', error);
    return sendResponse({
      success: false,
      statusCode: error.message?.includes('linked')
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to delete store',
      data: null,
    });
  }
};

// ================================================================
// ✅ GET VENDOR DASHBOARD
// ================================================================

const getVendorDashboard = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await dbConnect();
    const { id } = await params;

    if (!id || id.length !== 24) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid vendor ID format',
        data: null,
      });
    }

    const result = await StoreServices.vendorDashboard(id);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Vendor dashboard data fetched successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting vendor dashboard:', error);
    return sendResponse({
      success: false,
      statusCode: error.message?.includes('not found')
        ? StatusCodes.NOT_FOUND
        : StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to fetch vendor dashboard',
      data: null,
    });
  }
};

// ================================================================
// 📤 EXPORTS
// ================================================================

export const VendorStoreController = {
  createStore,
  getAllStores,
  getStoreById,
  getStoreByVendorId,
  updateStore,
  deleteStore,
  getVendorDashboard,
};