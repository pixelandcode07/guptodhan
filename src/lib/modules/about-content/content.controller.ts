// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-content\content.controller.ts
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { contentValidationSchema } from './content.validation';
import { AboutContentServices } from './content.service';
import dbConnect from '@/lib/db';

const getPublicContent = async (_req: NextRequest) => {
    await dbConnect();
    const result = await AboutContentServices.getContentFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Content retrieved successfully!', data: result });
};

const createOrUpdateContent = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = contentValidationSchema.parse(body);
    const result = await AboutContentServices.createOrUpdateContentInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Content updated successfully!', data: result });
};

const updateContent = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const validatedData = contentValidationSchema.partial().parse(body); // .partial() makes all fields optional
    const result = await AboutContentServices.updateContentInDB(id, validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Content updated successfully!', data: result });
};

export const AboutContentController = {
    getPublicContent,
    createOrUpdateContent,
    updateContent,
};