import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { 
  createChildCategoryValidationSchema, 
  updateChildCategoryValidationSchema 
} from '../validations/ecomChildCategory.validation';
import { ChildCategoryServices } from '../services/ecomChildCategory.service';
import { IChildCategory } from '../interfaces/ecomChildCategory.interface';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

// Create a new child category
const createChildCategory = async (req: NextRequest) => {
  try {
    await dbConnect();
    
    const form = await req.formData();
    
    const childCategoryId = (form.get('childCategoryId') as string) || '';
    const name = (form.get('name') as string) || '';
    const category = (form.get('category') as string) || '';
    const subCategory = (form.get('subCategory') as string) || '';
    const slug = (form.get('slug') as string) || '';
    const status = (form.get('status') as string) || 'active';
    const iconFile = form.get('childCategoryIcon') as File | null;

    
    // Validate category and subcategory ID formats
    if (!category || !Types.ObjectId.isValid(category)) {
      throw new Error(`Invalid category ID: ${category}. Must be a valid MongoDB ObjectId.`);
    }
    if (!subCategory || !Types.ObjectId.isValid(subCategory)) {
      throw new Error(`Invalid subcategory ID: ${subCategory}. Must be a valid MongoDB ObjectId.`);
    }

    let iconUrl = '';
    if (iconFile) {
      const b = Buffer.from(await iconFile.arrayBuffer());
      iconUrl = (await uploadToCloudinary(b, 'ecommerce-childcategory/icons')).secure_url;
    }

    const payload = { 
      childCategoryId, 
      name, 
      category, 
      subCategory,
      icon: iconUrl, 
      slug, 
      status 
    };
    
    const validatedData = createChildCategoryValidationSchema.parse(payload);

    const finalPayload = {
      ...validatedData,
      category: new Types.ObjectId(validatedData.category),
      subCategory: new Types.ObjectId(validatedData.subCategory),
    };

    const result = await ChildCategoryServices.createChildCategoryInDB(finalPayload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'ChildCategory created successfully!',
      data: result,
    });
  } catch (error: unknown) {
    console.error('❌ Error creating child category:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      data: null,
    });
  }
};

// Get all child categories
const getAllChildCategories = async (req: NextRequest) => {
  await dbConnect();
  
  // Check if subCategoryId query parameter is provided
  const { searchParams } = new URL(req.url);
  const subCategoryId = searchParams.get('subCategoryId');
  
  let result;
  if (subCategoryId) {
    // Filter by subcategory if subCategoryId is provided
    result = await ChildCategoryServices.getChildCategoriesBySubCategoryFromDB(subCategoryId);
  } else {
    // Get all child categories if no filter
    result = await ChildCategoryServices.getAllChildCategoriesFromDB();
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategories retrieved successfully!',
    data: result,
  });
};

// Get child categories by subcategory
const getChildCategoriesBySubCategory = async (req: NextRequest, { params }: { params: Promise<{ subCategoryId: string }> }) => {
  await dbConnect();
  const { subCategoryId } = await params;
  const result = await ChildCategoryServices.getChildCategoriesBySubCategoryFromDB(subCategoryId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategories retrieved successfully by subcategory!',
    data: result,
  });
};

// Update child category (await params; accept multipart form-data like create)
const updateChildCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await dbConnect();
    
    const { id } = await params;

    // Accept multipart form-data to support icon updates
    const form = await req.formData();

    const name = (form.get('name') as string) ?? undefined;
    const slug = (form.get('slug') as string) ?? undefined;
    const status = (form.get('status') as string) ?? undefined; // 'active' | 'inactive'
    const categoryId = (form.get('category') as string) ?? undefined; // optional category ObjectId
    const subCategoryId = (form.get('subCategory') as string) ?? undefined; // optional subcategory ObjectId

    const iconFile = form.get('childCategoryIcon') as File | null;


    const updatePayload: Record<string, unknown> = {};
    if (name !== undefined) updatePayload.name = name;
    if (slug !== undefined) updatePayload.slug = slug;
    if (status !== undefined) updatePayload.status = status;
    
    // Keep as strings for validation, convert to ObjectId later
    if (categoryId !== undefined && categoryId.trim() !== '') {
      updatePayload.category = categoryId;
    }
    
    if (subCategoryId !== undefined && subCategoryId.trim() !== '') {
      updatePayload.subCategory = subCategoryId;
    }

    if (iconFile) {
      const b = Buffer.from(await iconFile.arrayBuffer());
      updatePayload.icon = (await uploadToCloudinary(b, 'ecommerce-childcategory/icons')).secure_url;
    }


    // Validate using schema (fields optional)
    const validatedData = updateChildCategoryValidationSchema.parse(updatePayload);

    // Convert string IDs -> ObjectId for DB
    const dbPayload: Partial<IChildCategory> = {};
    
    // Copy non-ObjectId fields
    if (validatedData.childCategoryId) dbPayload.childCategoryId = validatedData.childCategoryId;
    if (validatedData.name) dbPayload.name = validatedData.name;
    if (validatedData.icon) dbPayload.icon = validatedData.icon;
    if (validatedData.slug) dbPayload.slug = validatedData.slug;
    if (validatedData.status) dbPayload.status = validatedData.status;
    
    // Convert string IDs to ObjectIds
    if (validatedData.category && typeof validatedData.category === 'string') {
      dbPayload.category = new Types.ObjectId(validatedData.category);
    }
    if (validatedData.subCategory && typeof validatedData.subCategory === 'string') {
      dbPayload.subCategory = new Types.ObjectId(validatedData.subCategory);
    }

    const result = await ChildCategoryServices.updateChildCategoryInDB(id, dbPayload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'ChildCategory updated successfully!',
      data: result,
    });
  } catch (error: unknown) {
    console.error('❌ Error updating child category:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      data: null,
    });
  }
};

// Delete child category
const deleteChildCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  await ChildCategoryServices.deleteChildCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategory deleted successfully!',
    data: null,
  });
};

export const ChildCategoryController = {
  createChildCategory,
  getAllChildCategories,
  getChildCategoriesBySubCategory,
  updateChildCategory,
  deleteChildCategory,
};
