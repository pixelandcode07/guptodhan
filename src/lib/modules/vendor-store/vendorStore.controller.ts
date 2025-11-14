import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createStoreValidationSchema, updateStoreValidationSchema } from './vendorStore.validation';
import { StoreServices } from './vendorStore.service';
import dbConnect from '@/lib/db';
import { uploadToCloudinary } from '@/lib/utils/cloudinary'; // <-- তুমি যেটা দিয়েছো, সেটাই

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

  const commissionValue = formData.get('commission');
  console.log('commission from formData:', commissionValue); // ← এটা দেখো

  const payload: any = {
    storeId: formData.get('storeId'),
    storeLogo,
    storeBanner,
    storeName: formData.get('storeName'),
    storeAddress: formData.get('storeAddress'),
    storePhone: formData.get('storePhone'),
    storeEmail: formData.get('storeEmail'),
    vendorShortDescription: formData.get('vendorShortDescription'),
    fullDescription: formData.get('fullDescription'),
    // commission: Number(formData.get('commission') || 0),
    // commission: formData.get('commission')
    //   ? Number(formData.get('commission'))
    //   : 0,
    commission: commissionValue ? Number(commissionValue) : 0,
    storeMetaTitle: formData.get('storeMetaTitle'),
    storeMetaKeywords: formData.get('storeMetaKeywords')
      ? JSON.parse(formData.get('storeMetaKeywords') as string)
      : [],
    storeMetaDescription: formData.get('storeMetaDescription'),
    storeSocialLinks: {
      facebook: formData.get('storeSocialLinks[facebook]') as string | null,
      whatsapp: formData.get('storeSocialLinks[whatsapp]') as string | null,
      instagram: formData.get('storeSocialLinks[instagram]') as string | null,
      linkedIn: formData.get('storeSocialLinks[linkedIn]') as string | null,
      twitter: formData.get('storeSocialLinks[twitter]') as string | null,
      tiktok: formData.get('storeSocialLinks[tiktok]') as string | null,
    },
  };

  const validatedData = createStoreValidationSchema.parse(payload);
  // const result = await StoreServices.createStoreInDB(validatedData);

  console.log(validatedData);

  // return sendResponse({
  //   success: true,
  //   statusCode: StatusCodes.CREATED,
  //   message: 'Store created successfully!',
  //   data: result,
  // });
};

// Get all stores
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
  updateStore,
  deleteStore,
};
