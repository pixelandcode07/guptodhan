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
import { VendorProductModel } from '../../product/vendorProduct.model';

// Create a new subcategory
// Create a new subcategory
const createSubCategory = async (req: NextRequest) => {
  try {
    await dbConnect();
    
    const form = await req.formData();
    
    const subCategoryId = (form.get('subCategoryId') as string) || '';
    const name = (form.get('name') as string) || '';
    const isFeatured = (form.get('isFeatured') as string) === 'true';
    const category = (form.get('category') as string) || '';
    let slug = (form.get('slug') as string) || ''; // User can provide slug
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
    
    // Validate category ID format
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
      slug, // ✅ Auto-generated slug
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
const getSubCategoriesByCategory = async (req: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) => {
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

// Update subcategory (await params; accept multipart form-data like create)
const updateSubCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await dbConnect();
    
    const { id } = await params;

    // Accept multipart form-data to support icon/banner updates
    const form = await req.formData();

    const name = (form.get('name') as string) ?? undefined;
    const slug = (form.get('slug') as string) ?? undefined;
    const status = (form.get('status') as string) ?? undefined; // 'active' | 'inactive'
    const isFeaturedStr = (form.get('isFeatured') as string) ?? undefined; // 'true' | 'false'
    const isNavbarStr = (form.get('isNavbar') as string) ?? undefined; // 'true' | 'false'
    const categoryId = (form.get('category') as string) ?? undefined; // optional category ObjectId

    const iconFile = form.get('subCategoryIcon') as File | null;
    const bannerFile = form.get('subCategoryBanner') as File | null;


    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = name;
    if (slug !== undefined) updatePayload.slug = slug;
    if (status !== undefined) updatePayload.status = status;
    if (isFeaturedStr !== undefined) updatePayload.isFeatured = isFeaturedStr === 'true';
    if (isNavbarStr !== undefined) updatePayload.isNavbar = isNavbarStr === 'true';
    
    // Only convert to ObjectId if categoryId is provided and valid
    if (categoryId !== undefined && categoryId.trim() !== '') {
      if (Types.ObjectId.isValid(categoryId)) {
        // Keep as string for Zod; convert to ObjectId after validation
        updatePayload.category = categoryId;
      } else {
        console.warn(`Skipping category update because provided value is not an ObjectId: ${categoryId}`);
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


    // Validate using schema (fields optional)
    const validatedData = updateSubCategoryValidationSchema.parse(updatePayload);

    // Convert string category -> ObjectId for DB
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

// Delete subcategory
const deleteSubCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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


// Get products by subcategory slug
const getProductsBySubCategorySlug = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  await dbConnect();
  const { slug } = await params;

  // First find subcategory by slug
  const subCategory = await SubCategoryServices.getSubCategoryBySlugFromDB(slug);

  if (!subCategory) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'SubCategory not found',
      data: null,
    });
  }

  // Get products using subcategory _id
  const products = await VendorProductModel.find({
    subCategory: subCategory._id,
    status: 'active',
  }).select('_id').lean();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: `Products for subcategory "${subCategory.name}" retrieved successfully!`,
    data: {
      subCategory: {
        name: subCategory.name,
        slug: subCategory.slug,
        subCategoryId: subCategory.subCategoryId,
      },
      productIds: products.map(p => String(p._id)), // ✅ Fixed
    },
  });
};

export const SubCategoryController = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory,
  getProductsBySubCategorySlug,
};
