// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\footer-widget\footerWidget.controller.ts
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createFooterWidgetSchema, updateFooterWidgetSchema } from './footerWidget.validation';
import { FooterWidgetServices } from './footerWidget.service';
import dbConnect from '@/lib/db';

const createWidget = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createFooterWidgetSchema.parse(body);
    const result = await FooterWidgetServices.createWidgetInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Footer widget created successfully!', data: result });
};

const getPublicWidgets = async (_req: NextRequest) => {
    await dbConnect();
    const result = await FooterWidgetServices.getPublicWidgetsFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Footer widgets retrieved successfully!', data: result });
};

const updateWidget = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateFooterWidgetSchema.parse(body);
    const result = await FooterWidgetServices.updateWidgetInDB(id, validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Footer widget updated successfully!', data: result });
};

const deleteWidget = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await FooterWidgetServices.deleteWidgetFromDB(id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Footer widget deleted successfully!', data: null });
};

export const FooterWidgetController = {
    createWidget,
    getPublicWidgets,
    updateWidget,
    deleteWidget,
};