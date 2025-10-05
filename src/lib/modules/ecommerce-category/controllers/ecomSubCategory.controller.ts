import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { 
  createSubCategoryValidationSchema, 
  updateSubCategoryValidationSchema 
} from '../validations/ecomSubCategory.validation';
import { SubCategoryServices } from '../services/ecomSubCategory.service';
import { ISubCategory } from '../interfaces/ecomSubCategory.interface';
import { CategoryModel } from '../models/ecomCategory.model'; // Import to ensure CategoryModel is registered
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

// Create a new subcategory
const createSubCategory = async (req: NextRequest) => {
  try {
    console.log('🚀 Starting subcategory creation...');
    await dbConnect();
    console.log('✅ Database connected');
    
    const form = await req.formData();
    console.log('✅ Form data parsed');
    
    const subCategoryId = (form.get('subCategoryId') as string) || '';
    const name = (form.get('name') as string) || '';
    const isFeatured = (form.get('isFeatured') as string) === 'true';
    const category = (form.get('category') as string) || '';
    const slug = (form.get('slug') as string) || '';
    const status = (form.get('status') as string) || 'active';
    const iconFile = form.get('subCategoryIcon') as File | null;
    const bannerFile = form.get('subCategoryBanner') as File | null;

    console.log('📝 Form data extracted:', { subCategoryId, name, category, slug, status, isFeatured });
    
    // Validate category ID format
    if (!category || !Types.ObjectId.isValid(category)) {
      throw new Error(`Invalid category ID: ${category}. Must be a valid MongoDB ObjectId.`);
    }

    let iconUrl = '';
    let bannerUrl = '';
    if (iconFile) {
      console.log('📤 Uploading icon file...');
      const b = Buffer.from(await iconFile.arrayBuffer());
      iconUrl = (await uploadToCloudinary(b, 'ecommerce-subcategory/icons')).secure_url;
      console.log('✅ Icon uploaded:', iconUrl);
    }
    if (bannerFile) {
      console.log('📤 Uploading banner file...');
      const b = Buffer.from(await bannerFile.arrayBuffer());
      bannerUrl = (await uploadToCloudinary(b, 'ecommerce-subcategory/banners')).secure_url;
      console.log('✅ Banner uploaded:', bannerUrl);
    }

    const payload = { 
      subCategoryId, 
      name, 
      category, 
      subCategoryIcon: iconUrl, 
      subCategoryBanner: bannerUrl, 
      isFeatured, 
      slug, 
      status 
    };
    console.log('📋 Payload prepared:', payload);
    
    const validatedData = createSubCategoryValidationSchema.parse(payload);
    console.log('✅ Data validated');

    const finalPayload = {
      ...validatedData,
      category: new Types.ObjectId(validatedData.category),
    };
    console.log('🔧 Final payload:', finalPayload);

    const result = await SubCategoryServices.createSubCategoryInDB(finalPayload);
    console.log('✅ Subcategory created in database:', result);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'SubCategory created successfully!',
      data: result,
    });
  } catch (error: unknown) {
    console.error('❌ Error creating subcategory:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      data: null,
    });
  }
};

// Get all subcategories
const getAllSubCategories = async () => {
  await dbConnect();
  const result = await SubCategoryServices.getAllSubCategoriesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'SubCategories retrieved successfully!',
    data: result,
  });
};

// Get subcategories by category
const getSubCategoriesByCategory = async (req: NextRequest, { params }: { params: { categoryId: string } }) => {
  await dbConnect();
  const { categoryId } = params;
  const result = await SubCategoryServices.getSubCategoriesByCategoryFromDB(categoryId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'SubCategories retrieved successfully by category!',
    data: result,
  });
};

// Update subcategory
const updateSubCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateSubCategoryValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    ...(validatedData.category && { category: new Types.ObjectId(validatedData.category) }),
  };

  const result = await SubCategoryServices.updateSubCategoryInDB(id, payload as Partial<ISubCategory>);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'SubCategory updated successfully!',
    data: result,
  });
};

// Delete subcategory
const deleteSubCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  await SubCategoryServices.deleteSubCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'SubCategory deleted successfully!',
    data: null,
  });
};

export const SubCategoryController = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory,
};
