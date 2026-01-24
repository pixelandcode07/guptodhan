import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { 
  createCategoryValidationSchema, 
  updateCategoryValidationSchema 
} from '../validations/ecomCategory.validation';
import { CategoryServices, getAllSubCategoriesWithChildren, reorderMainCategoriesService } from '../services/ecomCategory.service';
import dbConnect from '@/lib/db';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

// ================================================================
// 📝 CREATE CATEGORY
// ================================================================
const createCategory = async (req: NextRequest) => {
  try {
    await dbConnect();

    const formData = await req.formData();

    const name = (formData.get('name') as string) || '';
    const isFeaturedStr = (formData.get('isFeatured') as string) || 'false';
    const isNavbarStr = (formData.get('isNavbar') as string) || 'false';
    let slug = (formData.get('slug') as string) || '';
    const status = (formData.get('status') as string) || 'active';
    const categoryIconFile = formData.get('categoryIcon') as File | null;
    const categoryBannerFile = formData.get('categoryBanner') as File | null;

    // ✅ Auto-generate slug if not provided
    if (!slug) {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    }

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

// ================================================================
// 📋 GET ALL CATEGORIES
// ================================================================
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

// ================================================================
// 🔍 GET PRODUCT IDS BY CATEGORY
// ================================================================
export const getProductIdsByCategory = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) => {
  const resolvedParams = await params;
  const categoryId = resolvedParams.id;
  
  await dbConnect();
  
  const productIds = await CategoryServices.getProductIdsByCategoryFromDB(categoryId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: `Product IDs for category ${categoryId} retrieved successfully!`,
    data: productIds, 
  });
};

// ================================================================
// ⭐ GET FEATURED CATEGORIES
// ================================================================
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

// ================================================================
// ✏️ UPDATE CATEGORY
// ================================================================
const updateCategory = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) => {
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

// ================================================================
// 🗑️ DELETE CATEGORY
// ================================================================
const deleteCategory = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) => {
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

// ================================================================
// 🌳 GET ALL CATEGORIES WITH HIERARCHY (NAVBAR)
// ================================================================
export const getAllSubCategories = async (req: NextRequest) => {
  await dbConnect();

  const allCategories = await getAllSubCategoriesWithChildren();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All main categories with their subcategories and children retrieved successfully!',
    data: allCategories,
  });
};

// ================================================================
// 🔄 REORDER MAIN CATEGORIES
// ================================================================
const reorderMainCategories = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const { orderedIds } = body;

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid request: "orderedIds" must be a non-empty array.',
      data: null,
    });
  }

  const result = await reorderMainCategoriesService(orderedIds);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message || 'Main categories reordered successfully!',
    data: null,
  });
};

// ================================================================
// 🔍 GET PRODUCTS BY CATEGORY SLUG WITH FILTERS
// ================================================================
const getProductsByCategorySlug = async(
  req: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) => {
  await dbConnect();
  const { slug } = await params;
  
  const { searchParams } = new URL(req.url);
  
  const filters = {
    search: searchParams.get("search") || undefined,
    subCategory: searchParams.get("subCategory") || undefined,
    childCategory: searchParams.get("childCategory") || undefined,
    brand: searchParams.get("brand") || undefined,
    size: searchParams.get("size") || undefined,
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    sort: searchParams.get("sort") || undefined,
  };
  
  const result = await CategoryServices.getProductsByCategorySlugWithFiltersFromDB(
    slug,
    filters
  );
  
  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Category not found',
      data: null,
    });
  }

  // ✅ FIX: Type-safe category access
  const category = result.category as any;
  
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: `Products for category "${category.name}" retrieved successfully!`,
    data: {
      category: {
        name: category.name,
        slug: category.slug,
        categoryId: category.categoryId,
        banner: category.categoryBanner,
        icon: category.categoryIcon
      },
      products: result.products,
      totalProducts: result.products.length,
    },
  });
};

// ================================================================
// 📤 EXPORTS
// ================================================================
export const CategoryController = {
  createCategory,
  getAllCategories,
  getFeaturedCategories,
  updateCategory,
  deleteCategory,
  getProductsByCategorySlug,
  getAllSubCategories,
  reorderMainCategories,
  getProductIdsByCategory
};