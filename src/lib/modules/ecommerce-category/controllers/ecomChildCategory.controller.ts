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

// Update child category (await params; accept multipart form-data like create)
const updateChildCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    console.log('🚀 Starting child category update...');
    await dbConnect();
    console.log('✅ Database connected');
    
    const { id } = await params;
    console.log('📝 Updating child category ID:', id);

    // Accept multipart form-data to support icon updates
    const form = await req.formData();
    console.log('✅ Form data parsed');

    const name = (form.get('name') as string) ?? undefined;
    const slug = (form.get('slug') as string) ?? undefined;
    const status = (form.get('status') as string) ?? undefined; // 'active' | 'inactive'
    const categoryId = (form.get('category') as string) ?? undefined; // optional category ObjectId
    const subCategoryId = (form.get('subCategory') as string) ?? undefined; // optional subcategory ObjectId

    const iconFile = form.get('childCategoryIcon') as File | null;

    console.log('📝 Form data extracted:', { name, slug, status, categoryId, subCategoryId });

    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = name;
    if (slug !== undefined) updatePayload.slug = slug;
    if (status !== undefined) updatePayload.status = status;
    
    // Only convert to ObjectId if IDs are provided and valid
    if (categoryId !== undefined && categoryId.trim() !== '') {
      if (Types.ObjectId.isValid(categoryId)) {
        updatePayload.category = categoryId;
      } else {
        console.warn(`Skipping category update because provided value is not an ObjectId: ${categoryId}`);
      }
    }
    
    if (subCategoryId !== undefined && subCategoryId.trim() !== '') {
      if (Types.ObjectId.isValid(subCategoryId)) {
        updatePayload.subCategory = subCategoryId;
      } else {
        console.warn(`Skipping subcategory update because provided value is not an ObjectId: ${subCategoryId}`);
      }
    }

    if (iconFile) {
      console.log('📤 Uploading icon file...');
      const b = Buffer.from(await iconFile.arrayBuffer());
      updatePayload.icon = (await uploadToCloudinary(b, 'ecommerce-childcategory/icons')).secure_url;
      console.log('✅ Icon uploaded:', updatePayload.icon);
    }

    console.log('📋 Update payload prepared:', updatePayload);

    // Validate using schema (fields optional)
    const validatedData = updateChildCategoryValidationSchema.parse(updatePayload);
    console.log('✅ Data validated');

    // Convert string IDs -> ObjectId for DB
    const dbPayload: Partial<IChildCategory> = { ...(validatedData as any) };
    if (typeof (dbPayload as any).category === 'string') {
      (dbPayload as any).category = new Types.ObjectId((dbPayload as any).category);
    }
    if (typeof (dbPayload as any).subCategory === 'string') {
      (dbPayload as any).subCategory = new Types.ObjectId((dbPayload as any).subCategory);
    }

    const result = await ChildCategoryServices.updateChildCategoryInDB(id, dbPayload);
    console.log('✅ Child category updated in database:', result);

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
