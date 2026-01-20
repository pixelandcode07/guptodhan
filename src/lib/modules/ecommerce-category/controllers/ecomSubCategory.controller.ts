import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { 
  createSubCategoryValidationSchema, 
  updateSubCategoryValidationSchema 
} from '../validations/ecomSubCategory.validation';
import { SubCategoryServices } from '../services/ecomSubCategory.service';
import { ISubCategory } from '../interfaces/ecomSubCategory.interface';
import { CategoryModel } from '../models/ecomCategory.model';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

// ================================================================
// 📝 CREATE SUBCATEGORY
// ================================================================
const createSubCategory = async (req: NextRequest) => {
  try {
    await dbConnect();
    
    const form = await req.formData();
    
    const subCategoryId = (form.get('subCategoryId') as string) || '';
    const name = (form.get('name') as string) || '';
    const isFeatured = (form.get('isFeatured') as string) === 'true';
    const category = (form.get('category') as string) || '';
    let slug = (form.get('slug') as string) || '';
    const status = (form.get('status') as string) || 'active';
    const iconFile = form.get('subCategoryIcon') as File | null;
    const bannerFile = form.get('subCategoryBanner') as File | null;

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
    
    // Validate category ID
    if (!category || !Types.ObjectId.isValid(category)) {
      throw new Error(`Invalid category ID: ${category}. Must be a valid MongoDB ObjectId.`);
    }

    let iconUrl = '';
    let bannerUrl = '';
    
    if (iconFile) {
      const b = Buffer.from(await iconFile.arrayBuffer());
      iconUrl = (await uploadToCloudinary(b, 'ecommerce-subcategory/icons')).secure_url;
    }
    
    if (bannerFile) {
      const b = Buffer.from(await bannerFile.arrayBuffer());
      bannerUrl = (await uploadToCloudinary(b, 'ecommerce-subcategory/banners')).secure_url;
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
    
    const validatedData = createSubCategoryValidationSchema.parse(payload);

    const finalPayload = {
      ...validatedData,
      category: new Types.ObjectId(validatedData.category),
    };

    const result = await SubCategoryServices.createSubCategoryInDB(finalPayload);

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

// ================================================================
// 📋 GET ALL SUBCATEGORIES
// ================================================================
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

// ================================================================
// 🔍 GET SUBCATEGORIES BY CATEGORY
// ================================================================
const getSubCategoriesByCategory = async (
  req: NextRequest, 
  { params }: { params: Promise<{ categoryId: string }> }
) => {
  await dbConnect();
  const { categoryId } = await params;
  const result = await SubCategoryServices.getSubCategoriesByCategoryFromDB(categoryId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'SubCategories retrieved successfully by category!',
    data: result,
  });
};

// ================================================================
// ✏️ UPDATE SUBCATEGORY
// ================================================================
const updateSubCategory = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await dbConnect();
    
    const { id } = await params;
    const form = await req.formData();

    const name = (form.get('name') as string) ?? undefined;
    const slug = (form.get('slug') as string) ?? undefined;
    const status = (form.get('status') as string) ?? undefined;
    const isFeaturedStr = (form.get('isFeatured') as string) ?? undefined;
    const isNavbarStr = (form.get('isNavbar') as string) ?? undefined;
    const categoryId = (form.get('category') as string) ?? undefined;

    const iconFile = form.get('subCategoryIcon') as File | null;
    const bannerFile = form.get('subCategoryBanner') as File | null;

    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = name;
    if (slug !== undefined) updatePayload.slug = slug;
    if (status !== undefined) updatePayload.status = status;
    if (isFeaturedStr !== undefined) updatePayload.isFeatured = isFeaturedStr === 'true';
    if (isNavbarStr !== undefined) updatePayload.isNavbar = isNavbarStr === 'true';
    
    if (categoryId !== undefined && categoryId.trim() !== '') {
      if (Types.ObjectId.isValid(categoryId)) {
        updatePayload.category = categoryId;
      } else {
        console.warn(`Invalid category ID: ${categoryId}`);
      }
    }

    if (iconFile) {
      const b = Buffer.from(await iconFile.arrayBuffer());
      updatePayload.subCategoryIcon = (await uploadToCloudinary(b, 'ecommerce-subcategory/icons')).secure_url;
    }

    if (bannerFile) {
      const b = Buffer.from(await bannerFile.arrayBuffer());
      updatePayload.subCategoryBanner = (await uploadToCloudinary(b, 'ecommerce-subcategory/banners')).secure_url;
    }

    const validatedData = updateSubCategoryValidationSchema.parse(updatePayload);

    const dbPayload: Partial<ISubCategory> = { ...(validatedData as any) };
    if (typeof (dbPayload as any).category === 'string') {
      (dbPayload as any).category = new Types.ObjectId((dbPayload as any).category);
    }

    const result = await SubCategoryServices.updateSubCategoryInDB(id, dbPayload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'SubCategory updated successfully!',
      data: result,
    });
  } catch (error: unknown) {
    console.error('❌ Error updating subcategory:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      data: null,
    });
  }
};

// ================================================================
// 🗑️ DELETE SUBCATEGORY
// ================================================================
const deleteSubCategory = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  await SubCategoryServices.deleteSubCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'SubCategory deleted successfully!',
    data: null,
  });
};

// ================================================================
// 🔍 GET PRODUCTS BY SUBCATEGORY SLUG WITH FILTERS
// ================================================================
const getProductsBySubCategorySlug = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  await dbConnect();
  const { slug } = await params;

  const { searchParams } = new URL(req.url);
  
  const filters = {
    search: searchParams.get("search") || undefined,
    brand: searchParams.get("brand") || undefined,
    size: searchParams.get("size") || undefined,
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    sort: searchParams.get("sort") || undefined,
  };

  const result = await SubCategoryServices.getProductsBySubCategorySlugWithFiltersFromDB(
    slug,
    filters
  );

  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'SubCategory not found',
      data: null,
    });
  }

  // ✅ Type-safe access
  const subCategory = result.subCategory as any;

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: `Products for subcategory "${subCategory.name}" retrieved successfully!`,
    data: {
      subCategory: {
        name: subCategory.name,
        slug: subCategory.slug,
        subCategoryId: subCategory.subCategoryId,
        banner: subCategory.subCategoryBanner
      },
      products: result.products,
      totalProducts: result.totalProducts,
    },
  });
};

// ================================================================
// 📤 EXPORTS
// ================================================================
export const SubCategoryController = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory,
  getProductsBySubCategorySlug,
};