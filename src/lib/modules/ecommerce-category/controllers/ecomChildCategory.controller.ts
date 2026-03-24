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

// ================================================================
// 📝 CREATE CHILD CATEGORY
// ================================================================
const createChildCategory = async (req: NextRequest) => {
  try {
    await dbConnect();
    
    const form = await req.formData();
    
    const childCategoryId = (form.get('childCategoryId') as string) || '';
    const name = (form.get('name') as string) || '';
    const category = (form.get('category') as string) || '';
    const subCategory = (form.get('subCategory') as string) || '';
    let slug = (form.get('slug') as string) || '';
    const status = (form.get('status') as string) || 'active';
    const iconFile = form.get('childCategoryIcon') as File | null;

    // ✅ Auto-generate slug
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
    
    // Validate IDs
    if (!category || !Types.ObjectId.isValid(category)) {
      throw new Error(`Invalid category ID: ${category}`);
    }
    if (!subCategory || !Types.ObjectId.isValid(subCategory)) {
      throw new Error(`Invalid subcategory ID: ${subCategory}`);
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

// ================================================================
// 📋 GET ALL CHILD CATEGORIES
// ================================================================
const getAllChildCategories = async (req: NextRequest) => {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const subCategoryId = searchParams.get('subCategoryId');
  
  let result;
  if (subCategoryId) {
    result = await ChildCategoryServices.getChildCategoriesBySubCategoryFromDB(subCategoryId);
  } else {
    result = await ChildCategoryServices.getAllChildCategoriesFromDB();
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategories retrieved successfully!',
    data: result,
  });
};

// ================================================================
// 🔍 GET CHILD CATEGORIES BY SUBCATEGORY
// ================================================================
const getChildCategoriesBySubCategory = async (
  req: NextRequest, 
  { params }: { params: Promise<{ subCategoryId: string }> }
) => {
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

// ================================================================
// ✏️ UPDATE CHILD CATEGORY
// ================================================================
const updateChildCategory = async (
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
    const categoryId = (form.get('category') as string) ?? undefined;
    const subCategoryId = (form.get('subCategory') as string) ?? undefined;
    const iconFile = form.get('childCategoryIcon') as File | null;

    const updatePayload: Record<string, unknown> = {};
    if (name !== undefined) updatePayload.name = name;
    if (slug !== undefined) updatePayload.slug = slug;
    if (status !== undefined) updatePayload.status = status;
    
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

    const validatedData = updateChildCategoryValidationSchema.parse(updatePayload);

    const dbPayload: Partial<IChildCategory> = {};
    
    if (validatedData.childCategoryId) dbPayload.childCategoryId = validatedData.childCategoryId;
    if (validatedData.name) dbPayload.name = validatedData.name;
    if (validatedData.icon) dbPayload.icon = validatedData.icon;
    if (validatedData.slug) dbPayload.slug = validatedData.slug;
    if (validatedData.status) dbPayload.status = validatedData.status;
    
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

// ================================================================
// 🗑️ DELETE CHILD CATEGORY
// ================================================================
const deleteChildCategory = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
   console.log('DELETE id:', id); 
  await ChildCategoryServices.deleteChildCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategory deleted successfully!',
    data: null,
  });
};

// ================================================================
// 🔍 GET PRODUCTS BY CHILD CATEGORY SLUG WITH FILTERS
// ================================================================
const getProductsByChildCategorySlug = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  await dbConnect();

  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const { searchParams } = new URL(req.url);

  const filters = {
    search:   searchParams.get('search')   || undefined,
    brand:    searchParams.get('brand')    || undefined,
    size:     searchParams.get('size')     || undefined,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    sort:     searchParams.get('sort')     || undefined,
    // ✅ নতুন
    page:     searchParams.get('page')  ? Number(searchParams.get('page'))  : 1,
    limit:    searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
  };

  const result = await ChildCategoryServices.getProductsByChildCategorySlugWithFiltersFromDB(
    decodedSlug,
    filters
  );

  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Child category not found',
      data: null,
    });
  }

  const childCategory = result.childCategory as any;

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: `Products for "${childCategory.name}" retrieved!`,
    data: {
      childCategory: {
        name: childCategory.name,
        slug: childCategory.slug,
        childCategoryId: childCategory.childCategoryId,
        icon: childCategory.icon,
      },
      products:      result.products,
      totalProducts: result.totalProducts,
      // ✅ নতুন meta
      meta: {
        total:      result.totalProducts,
        page:       result.page,
        limit:      result.limit,
        totalPages: result.totalPages,
        hasNext:    result.hasNext,
        hasPrev:    result.hasPrev,
      },
    },
  });
};

// ================================================================
// 📤 EXPORTS
// ================================================================
export const ChildCategoryController = {
  createChildCategory,
  getAllChildCategories,
  getChildCategoriesBySubCategory,
  updateChildCategory,
  deleteChildCategory,
  getProductsByChildCategorySlug,
};