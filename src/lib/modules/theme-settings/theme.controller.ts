// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\theme-settings\theme.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { updateThemeValidationSchema } from './theme.validation';
import { ThemeSettingsServices } from './theme.service';
import dbConnect from '@/lib/db';

const createOrUpdateTheme = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = updateThemeValidationSchema.parse(body);
    const result = await ThemeSettingsServices.createOrUpdateThemeInDB(validatedData);
    
    return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.OK, 
        message: 'Theme colors updated successfully!', 
        data: result 
    });
};

// ✅ NEW: Public GET-এর জন্য
const getPublicTheme = async (_req: NextRequest) => {
    await dbConnect();
    const result = await ThemeSettingsServices.getPublicThemeFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Theme settings retrieved!', data: result });
};

// ✅ NEW: PATCH-এর জন্য
const updateTheme = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateThemeValidationSchema.partial().parse(body);
    const result = await ThemeSettingsServices.updateThemeInDB(id, validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Theme updated successfully!', data: result });
};

// ✅ NEW: DELETE-এর জন্য
const deleteTheme = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    await ThemeSettingsServices.deleteThemeFromDB(id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Theme deleted successfully!', data: null });
};


export const ThemeSettingsController = {
    createOrUpdateTheme,
    getPublicTheme,
    updateTheme,    // <-- যোগ করুন
    deleteTheme,    // <-- যোগ করুন
};