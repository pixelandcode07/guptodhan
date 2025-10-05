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
    console.log('🚀 Starting child category creation...');
    await dbConnect();
    console.log('✅ Database connected');
    
    const form = await req.formData();
    console.log('✅ Form data parsed');
    
    const childCategoryId = (form.get('childCategoryId') as string) || '';
    const name = (form.get('name') as string) || '';
    const category = (form.get('category') as string) || '';
    const subCategory = (form.get('subCategory') as string) || '';
    const slug = (form.get('slug') as string) || '';
    const status = (form.get('status') as string) || 'active';
    const iconFile = form.get('childCategoryIcon') as File | null;

    console.log('📝 Form data extracted:', { childCategoryId, name, category, subCategory, slug, status });
    
    // Validate category and subcategory ID formats
    if (!category || !Types.ObjectId.isValid(category)) {
      throw new Error(`Invalid category ID: ${category}. Must be a valid MongoDB ObjectId.`);
    }
    if (!subCategory || !Types.ObjectId.isValid(subCategory)) {
      throw new Error(`Invalid subcategory ID: ${subCategory}. Must be a valid MongoDB ObjectId.`);
    }

    let iconUrl = '';
    if (iconFile) {
      console.log('📤 Uploading icon file...');
      const b = Buffer.from(await iconFile.arrayBuffer());
      iconUrl = (await uploadToCloudinary(b, 'ecommerce-childcategory/icons')).secure_url;
      console.log('✅ Icon uploaded:', iconUrl);
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
    console.log('📋 Payload prepared:', payload);
    
    const validatedData = createChildCategoryValidationSchema.parse(payload);
    console.log('✅ Data validated');

    const finalPayload = {
      ...validatedData,
      category: new Types.ObjectId(validatedData.category),
      subCategory: new Types.ObjectId(validatedData.subCategory),
    };
    console.log('🔧 Final payload:', finalPayload);

    const result = await ChildCategoryServices.createChildCategoryInDB(finalPayload);
    console.log('✅ Child category created in database:', result);

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
const getAllChildCategories = async () => {
  await dbConnect();
  const result = await ChildCategoryServices.getAllChildCategoriesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategories retrieved successfully!',
    data: result,
  });
};

// Get child categories by subcategory
const getChildCategoriesBySubCategory = async (req: NextRequest, { params }: { params: { subCategoryId: string } }) => {
  await dbConnect();
  const { subCategoryId } = params;
  const result = await ChildCategoryServices.getChildCategoriesBySubCategoryFromDB(subCategoryId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategories retrieved successfully by subcategory!',
    data: result,
  });
};

// Update child category
const updateChildCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateChildCategoryValidationSchema.parse(body);

  const payload: Partial<IChildCategory> = {};

  // Copy non-ObjectId fields
  if (validatedData.childCategoryId) payload.childCategoryId = validatedData.childCategoryId;
  if (validatedData.name) payload.name = validatedData.name;
  if (validatedData.icon) payload.icon = validatedData.icon;
  if (validatedData.slug) payload.slug = validatedData.slug;
  if (validatedData.status) payload.status = validatedData.status;

  // Convert string IDs to ObjectIds
  if (validatedData.category) {
    payload.category = new Types.ObjectId(validatedData.category);
  }
  if (validatedData.subCategory) {
    payload.subCategory = new Types.ObjectId(validatedData.subCategory);
  }

  const result = await ChildCategoryServices.updateChildCategoryInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategory updated successfully!',
    data: result,
  });
};

// Delete child category
const deleteChildCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
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
