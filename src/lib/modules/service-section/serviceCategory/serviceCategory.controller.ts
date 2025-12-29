import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createServiceCategoryValidationSchema, updateServiceCategoryValidationSchema } from './serviceCategory.validation';
import { ServiceCategoryServices } from './serviceCategory.service';
import { IServiceCategory } from './serviceCategory.interface';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import dbConnect from '@/lib/db';

// convert File to Buffer
const fileToBuffer = async (file: File): Promise<Buffer> => {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
};

// generate slug
const generateSlug = (name: string) => {
    return name
        .trim()               
        .toLowerCase()          
        .replace(/\s+/g, '-')   
        .replace(/[^\w-]/g, '');
};

// Create a new service category
const createServiceCategory = async (req: NextRequest) => {
    await dbConnect();
    try {
        const formData = await req.formData();

        console.log('Received form data:', formData);

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const iconFile = formData.get('icon_url') as File | null;
        const slug = generateSlug(name);


        const validatedData = createServiceCategoryValidationSchema.parse({ name, description,slug, icon_url: iconFile ? 'dummy' : '' });


        let iconUrl = '';
        if (iconFile) {
            const iconBuffer = await fileToBuffer(iconFile);
            const uploadedIcon = await uploadToCloudinary(iconBuffer, 'service-categories/icons');
            iconUrl = uploadedIcon.secure_url;
        }

        const payload: Partial<IServiceCategory> = {
            name: validatedData.name,
            description: validatedData.description,
            slug,
            icon_url: iconUrl,
        };

        const result = await ServiceCategoryServices.createServiceCategoryInDB(payload);

        return sendResponse({
            success: true,
            statusCode: StatusCodes.CREATED,
            message: 'Service category created successfully!',
            data: result,
        });
    } catch (error) {
        console.error('Error creating service category:', error);
        return sendResponse({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Failed to create service category',
            data: null,
        });
    }
};


// Get all service categories
const getAllServiceCategories = async () => {
    await dbConnect();
    const result = await ServiceCategoryServices.getAllServiceCategoriesFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Service categories retrieved successfully!',
        data: result,
    });
};

// Get service category by ID
const getServiceCategoryById = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const result = await ServiceCategoryServices.getServiceCategoryByIdFromDB(id);

    if (!result) {
        return sendResponse({
            success: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: 'Service category not found',
            data: null,
        });
    }

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Service category retrieved successfully!',
        data: result,
    });
};

// Get service category by slug
const getServiceCategoryBySlug = async (req: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    await dbConnect();
    const { slug } = await params;

    const result = await ServiceCategoryServices.getServiceCategoryBySlugFromDB(slug);

    if (!result) {
        return sendResponse({
            success: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: 'Service category not found',
            data: null,
        });
    }

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Service category retrieved successfully!',
        data: result,
    });
};


// Update service category
const updateServiceCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const iconFile = formData.get('icon_url') as File | null;

    const validatedData = updateServiceCategoryValidationSchema.parse({ name, description, icon_url: iconFile ? 'dummy' : '' });

    const payload: Partial<IServiceCategory> = {};

    if (validatedData.name) {
        payload.name = validatedData.name;
        payload.slug = generateSlug(validatedData.name); // manual slug generation
    }
    if (validatedData.description) payload.description = validatedData.description;

    if (iconFile) {
        const iconBuffer = await fileToBuffer(iconFile);
        const uploadedIcon = await uploadToCloudinary(iconBuffer, 'service-categories/icons');
        payload.icon_url = uploadedIcon.secure_url;
    }

    const result = await ServiceCategoryServices.updateServiceCategoryInDB(id, payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Service category updated successfully!',
        data: result,
    });
};


// demo update controller code 
// export const updateServiceCategory = async (
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) => {
//     await dbConnect();

//     try {
//         const { id } = await params;
//         const body = await req.json();
//         const { name, description, icon_url } = body;

//         console.log('Update data received:', body);

//         if (!id) {
//             return sendResponse({
//                 success: false,
//                 statusCode: StatusCodes.BAD_REQUEST,
//                 message: 'Category ID is required.',
//                 data: null,
//             });
//         }

//         const payload: any = {};

//         if (name) {
//             payload.name = name;
//             payload.slug = generateSlug(name); // regenerate slug if name changes
//         }
//         if (description) payload.description = description;
//         if (icon_url) payload.icon_url = icon_url;

//         const updatedCategory = await ServiceCategoryServices.updateServiceCategoryInDB(id, payload);

//         if (!updatedCategory) {
//             return sendResponse({
//                 success: false,
//                 statusCode: StatusCodes.NOT_FOUND,
//                 message: 'Service category not found.',
//                 data: null,
//             });
//         }

//         return sendResponse({
//             success: true,
//             statusCode: StatusCodes.OK,
//             message: 'Service category updated successfully!',
//             data: updatedCategory,
//         });
//     } catch (error) {
//         console.error('Error updating service category:', error);
//         return sendResponse({
//             success: false,
//             statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//             message: 'Failed to update service category',
//             data: null,
//         });
//     }
// };

// Delete service category
const deleteServiceCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;

    await ServiceCategoryServices.deleteServiceCategoryFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Service category deleted successfully!',
        data: null,
    });
};

export const ServiceCategoryController = {
    createServiceCategory,
    getAllServiceCategories,
    getServiceCategoryById,
    getServiceCategoryBySlug,
    updateServiceCategory,
    deleteServiceCategory,
};
