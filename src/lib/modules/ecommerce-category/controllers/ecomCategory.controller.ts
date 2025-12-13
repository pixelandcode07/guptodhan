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

// Create a new category (multipart FormData like Brand)
// Create a new category (multipart FormData like Brand)
const createCategory = async (req: NextRequest) => {
  try {
    await dbConnect();

    const formData = await req.formData();

    const name = (formData.get('name') as string) || '';
    const isFeaturedStr = (formData.get('isFeatured') as string) || 'false';
    const isNavbarStr = (formData.get('isNavbar') as string) || 'false';
    let slug = (formData.get('slug') as string) || ''; // User can provide slug
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
      slug, // ✅ Auto-generated slug
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

// GET product IDs by category
export const getProductIdsByCategory = async (req: NextRequest, {  params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const categoryId = resolvedParams.id;
  console.log('Params received in controller:', categoryId);
  
  await dbConnect();
  
  // Use the extracted categoryId
  const productIds = await CategoryServices.getProductIdsByCategoryFromDB(categoryId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: `Product IDs for category ${categoryId} retrieved successfully!`,
    data: productIds, 
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




// ------------------ 
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

// ---------------------

// Reorder e-commerce main categories (drag-and-drop)
const reorderMainCategories = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const { orderedIds } = body;

  // Validate input
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid request: "orderedIds" must be a non-empty array.',
      data: null,
    });
  }

  // Call the reorder service
  const result = await reorderMainCategoriesService(orderedIds);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message || 'Main categories reordered successfully!',
    data: null,
  });
};

// ✅ Get products by category slug with filters (Brand Name, SubCat Name, etc.)
const getProductsByCategorySlug = async (
  req: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) => {
  await dbConnect();
  const { slug } = await params;
  
  // URL থেকে ফিল্টার প্যারামিটারগুলো নিচ্ছি
  const { searchParams } = new URL(req.url);
  
  const filters = {
    search: searchParams.get("search") || undefined,
    // এখন আর ID না, সরাসরি নাম যাচ্ছে (যেমন: "Smart Phone")
    subCategory: searchParams.get("subCategory") || undefined, 
    // নাম যাচ্ছে (যেমন: "Android")
    childCategory: searchParams.get("childCategory") || undefined, 
    // নাম যাচ্ছে (যেমন: "Samsung")
    brand: searchParams.get("brand") || undefined, 
    // নাম যাচ্ছে (যেমন: "XL")
    size: searchParams.get("size") || undefined, 
    
    // প্রাইস এবং সর্টিং
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    sort: searchParams.get("sort") || undefined,
  };
  
  // সার্ভিস কল করা হচ্ছে
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
  
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: `Products for category "${result.category.name}" retrieved successfully!`,
    data: {
      category: {
        name: result.category.name,
        slug: result.category.slug,
        categoryId: result.category.categoryId,
        banner: result.category.categoryBanner,
        icon: result.category.categoryIcon
      },
      products: result.products,
      totalProducts: result.products.length,
    },
  });
};

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
