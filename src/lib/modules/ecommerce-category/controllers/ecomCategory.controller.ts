import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { 
  createCategoryValidationSchema, 
  updateCategoryValidationSchema 
} from '../validations/ecomCategory.validation';
import { CategoryServices } from '../services/ecomCategory.service';
import dbConnect from '@/lib/db';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

// Create a new category (multipart FormData like Brand)
const createCategory = async (req: NextRequest) => {
  try {
    await dbConnect();

    const formData = await req.formData();

    const categoryId = (formData.get('categoryId') as string) || '';
    const name = (formData.get('name') as string) || '';
    const isFeaturedStr = (formData.get('isFeatured') as string) || 'false';
    const isNavbarStr = (formData.get('isNavbar') as string) || 'false';
    const slug = (formData.get('slug') as string) || '';
    const status = (formData.get('status') as string) || 'active';
    const categoryIconFile = formData.get('categoryIcon') as File | null;
    const categoryBannerFile = formData.get('categoryBanner') as File | null;

    let iconUrl = '';
    let bannerUrl = '';

    if (categoryIconFile) {
      const buffer = Buffer.from(await categoryIconFile.arrayBuffer());
      const uploaded = await uploadToCloudinary(buffer, 'ecommerce-category/icons');
      iconUrl = uploaded.secure_url;
    }

    if (categoryBannerFile) {
      const buffer = Buffer.from(await categoryBannerFile.arrayBuffer());
      const uploaded = await uploadToCloudinary(buffer, 'ecommerce-category/banners');
      bannerUrl = uploaded.secure_url;
    }

    const payload = {
      categoryId,
      name,
      categoryIcon: iconUrl,
      categoryBanner: bannerUrl,
      isFeatured: isFeaturedStr === 'true',
      isNavbar: isNavbarStr === 'true',
      slug,
      status,
    };

    const validatedData = createCategoryValidationSchema.parse(payload);
    const result = await CategoryServices.createCategoryInDB(validatedData);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Category created successfully!',
      data: result,
    });
  } catch (error: any) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error?.message || 'Internal server error',
      data: null,
    });
  }
};

// Get all categories
const getAllCategories = async () => {
  await dbConnect();
  const result = await CategoryServices.getAllCategoriesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Categories retrieved successfully!',
    data: result,
  });
};

// Update category
const updateCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateCategoryValidationSchema.parse(body);

  const result = await CategoryServices.updateCategoryInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category updated successfully!',
    data: result,
  });
};

// Delete category
const deleteCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  await CategoryServices.deleteCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category deleted successfully!',
    data: null,
  });
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
