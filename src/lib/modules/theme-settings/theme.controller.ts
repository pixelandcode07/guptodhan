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

const getPublicTheme = async (_req: NextRequest) => {
    await dbConnect();
    const result = await ThemeSettingsServices.getPublicThemeFromDB();
    return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.OK, 
        message: 'Theme colors retrieved successfully!', 
        data: result 
    });
};

export const ThemeSettingsController = {
    createOrUpdateTheme,
    getPublicTheme,
};