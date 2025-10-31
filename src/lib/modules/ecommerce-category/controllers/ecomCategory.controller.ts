import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { 
  createCategoryValidationSchema, 
  updateCategoryValidationSchema 
} from '../validations/ecomCategory.validation';
import { CategoryServices, getSubCategoriesWithChildren } from '../services/ecomCategory.service';
import dbConnect from '@/lib/db';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

// Create a new category (multipart FormData like Brand)
const createCategory = async (req: NextRequest) => {
  try {
    await dbConnect();

    const formData = await req.formData();

    // const categoryId = (formData.get('categoryId') as string) || '';
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

// Get only featured categories (optimized for landing page)
const getFeaturedCategories = async () => {
  await dbConnect();
  const result = await CategoryServices.getFeaturedCategoriesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Featured categories retrieved successfully!',
    data: result,
  });
};

// Update category (await params and accept multipart like Brand)
const updateCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await dbConnect();
    const { id } = await params;

    const formData = await req.formData();

    const name = (formData.get('name') as string) ?? undefined;
    const slug = (formData.get('slug') as string) ?? undefined;
    const status = (formData.get('status') as string) ?? undefined;
    const isFeaturedStr = (formData.get('isFeatured') as string) ?? undefined;
    const isNavbarStr = (formData.get('isNavbar') as string) ?? undefined;
    const categoryIconFile = formData.get('categoryIcon') as File | null;
    const categoryBannerFile = formData.get('categoryBanner') as File | null;

    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = name;
    if (slug !== undefined) updatePayload.slug = slug;
    if (status !== undefined) updatePayload.status = status;
    if (isFeaturedStr !== undefined) updatePayload.isFeatured = isFeaturedStr === 'true';
    if (isNavbarStr !== undefined) updatePayload.isNavbar = isNavbarStr === 'true';

    if (categoryIconFile) {
      const buffer = Buffer.from(await categoryIconFile.arrayBuffer());
      const uploaded = await uploadToCloudinary(buffer, 'ecommerce-category/icons');
      updatePayload.categoryIcon = uploaded.secure_url;
    }

    if (categoryBannerFile) {
      const buffer = Buffer.from(await categoryBannerFile.arrayBuffer());
      const uploaded = await uploadToCloudinary(buffer, 'ecommerce-category/banners');
      updatePayload.categoryBanner = uploaded.secure_url;
    }

    const validatedData = updateCategoryValidationSchema.parse(updatePayload);
    const result = await CategoryServices.updateCategoryInDB(id, validatedData);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category updated successfully!',
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

// Delete category (await params)
const deleteCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  await CategoryServices.deleteCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category deleted successfully!',
    data: null,
  });
};

export const getSubCategoriesByCategory = async (
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) => {
  await dbConnect();

  const { categoryId } = await params;

  const subCategories = await getSubCategoriesWithChildren(categoryId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subcategories with children retrieved successfully!',
    data: subCategories,
  });
};

export const CategoryController = {
  getSubCategoriesByCategory,
  createCategory,
  getAllCategories,
  getFeaturedCategories,
  updateCategory,
  deleteCategory,
};
