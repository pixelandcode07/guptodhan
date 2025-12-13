import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { updateBrandValidationSchema } from '../validations/brandName.validation';
import { BrandServices, reorderBrandNamesService } from '../services/brandName.service';
import { IBrand } from '../interfaces/brandName.interface';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import dbConnect from '@/lib/db';

// Create a new brand
const createBrand = async (req: NextRequest) => {
    await dbConnect();
    
    try {
        const formData = await req.formData();
        
        // Extract form data
        const brandId = formData.get('brandId') as string;
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const subCategory = formData.get('subCategory') as string;
        const childCategory = formData.get('childCategory') as string;
        const brandLogo = formData.get('brandLogo') as File | null;
        const brandBanner = formData.get('brandBanner') as File | null;

        // Convert File to Buffer for Cloudinary upload
        const fileToBuffer = async (file: File): Promise<Buffer> => {
            const arrayBuffer = await file.arrayBuffer();
            return Buffer.from(arrayBuffer);
        };

        // Upload to Cloudinary
        let logoUrl = '';
        let bannerUrl = '';

        if (brandLogo) {
            const logoBuffer = await fileToBuffer(brandLogo);
            const uploadedLogo = await uploadToCloudinary(logoBuffer, 'brands/logos');
            logoUrl = uploadedLogo.secure_url;
        }

        if (brandBanner) {
            const bannerBuffer = await fileToBuffer(brandBanner);
            const uploadedBanner = await uploadToCloudinary(bannerBuffer, 'brands/banners');
            bannerUrl = uploadedBanner.secure_url;
        }

        const validatedData = {
            brandId,
            name,
            brandLogo: logoUrl,
            brandBanner: bannerUrl,
            category,
            subCategory,
            childCategory,
            status: 'active' as const,
            featured: 'not_featured' as const
        };

        const payload = {
            brandId: validatedData.brandId,
            name: validatedData.name,
            brandLogo: validatedData.brandLogo,
            brandBanner: validatedData.brandBanner,
            category: validatedData.category,
            subCategory: validatedData.subCategory,
            childCategory: validatedData.childCategory,
            status: validatedData.status,
            featured: validatedData.featured
        };

        const result = await BrandServices.createBrandInDB(payload);

        return sendResponse({
            success: true,
            statusCode: StatusCodes.CREATED,
            message: 'Brand created successfully!',
            data: result,
        });
    } catch (error) {
        console.error('Error creating brand:', error);
        return sendResponse({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Failed to create brand',
            data: null,
        });
    }
};

// Get all brands
const getAllBrands = async () => {
    await dbConnect();
    const result = await BrandServices.getAllBrandsFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Brands retrieved successfully!',
        data: result,
    });
};

// Get all active brands Name
const getAllActiveBrandsName = async () => {
    await dbConnect();
    const result = await BrandServices.getAllActiveBrandsName();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Active brands retrieved successfully!',
        data: result,
    });
};

// Update brand
const updateBrand = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateBrandValidationSchema.parse(body);

    const payload: Partial<IBrand> = {};
    
    if (validatedData.brandId) payload.brandId = validatedData.brandId;
    if (validatedData.name) payload.name = validatedData.name;
    if (validatedData.brandLogo) payload.brandLogo = validatedData.brandLogo;
    if (validatedData.brandBanner) payload.brandBanner = validatedData.brandBanner;
    if (validatedData.status) payload.status = validatedData.status;
    if (validatedData.featured) payload.featured = validatedData.featured;
    
    if (validatedData.category) {
        payload.category = validatedData.category;
    }
    if (validatedData.subCategory) {
        payload.subCategory = validatedData.subCategory;
    }
    if (validatedData.childCategory) {
        payload.childCategory = validatedData.childCategory;
    }

    const result = await BrandServices.updateBrandInDB(id, payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Brand updated successfully!',
        data: result,
    });
};

// Delete brand
const deleteBrand = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    await BrandServices.deleteBrandFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Brand deleted successfully!',
        data: null,
    });
};

// Reorder brand names (drag-and-drop)
const reorderBrandNames = async (req: NextRequest) => {
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
  const result = await reorderBrandNamesService(orderedIds);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message || 'Brand names reordered successfully!',
    data: null,
  });
};

export const BrandController = {
    createBrand,
    getAllBrands,
    getAllActiveBrandsName,
    updateBrand,
    deleteBrand,

    reorderBrandNames
};
