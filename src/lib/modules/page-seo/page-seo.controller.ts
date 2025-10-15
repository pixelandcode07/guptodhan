import { NextRequest } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createPageSeoSchema } from './page-seo.validation'; // Assuming you have an update schema too
import { PageSeoServices } from './page-seo.service';
import dbConnect from '@/lib/db';

const createPage = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();
    
    const payload: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
        if (key !== 'featureImage') {
            payload[key] = value;
        }
    }
    
    const imageFile = formData.get('featureImage') as File | null;
    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'page-seo-images');
        payload.featureImage = uploadResult.secure_url;
    }

    const validatedData = createPageSeoSchema.parse(payload);
    const result = await PageSeoServices.createPageSeoInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Page created successfully!', data: result });
};

const getAllPages = async (_req: NextRequest) => {
    await dbConnect();
    const result = await PageSeoServices.getAllPagesSeoFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'All pages retrieved!', data: result });
};

const getPublicPage = async (req: NextRequest) => {
    await dbConnect();
    const pageTitle = req.nextUrl.searchParams.get('title');
    if (!pageTitle) throw new Error('Page title query is required.');
    const result = await PageSeoServices.getPublicPageByTitleFromDB(pageTitle);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Page retrieved!', data: result });
};

// ✅ NEW: Function to handle PATCH requests
const updatePage = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const formData = await req.formData();
    
    const payload: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
        if (key !== 'featureImage') {
            payload[key] = value;
        }
    }
    
    const imageFile = formData.get('featureImage') as File | null;
    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'page-seo-images');
        payload.featureImage = uploadResult.secure_url;
    }

    // Use .partial() to allow updating only some fields
    const validatedData = createPageSeoSchema.partial().parse(payload);
    const result = await PageSeoServices.updatePageSeoInDB(id, validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Page updated successfully!', data: result });
};

// ✅ NEW: Function to handle DELETE requests
const deletePage = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    await PageSeoServices.deletePageSeoFromDB(id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Page deleted successfully!', data: null });
};

export const PageSeoController = {
    createPage,
    getAllPages,
    getPublicPage,
    updatePage, // ✅ Add this
    deletePage, // ✅ Add this
};