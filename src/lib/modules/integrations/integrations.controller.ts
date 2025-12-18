// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\integrations\integrations.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { updateIntegrationsSchema } from './integrations.validation';
import { IntegrationsServices } from './integrations.service';
import dbConnect from '@/lib/db';

const createOrUpdateIntegrations = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    
    // Boolean মানগুলোকে সঠিকভাবে পার্স করা হচ্ছে
    const parsedBody = {
        ...body,
        googleAnalyticsEnabled: body.googleAnalyticsEnabled === 'Enable' || body.googleAnalyticsEnabled === true,
        googleTagManagerEnabled: body.googleTagManagerEnabled === 'Enable' || body.googleTagManagerEnabled === true,
        facebookPixelEnabled: body.facebookPixelEnabled === 'Enable' || body.facebookPixelEnabled === true,
        googleSearchConsoleEnabled: body.googleSearchConsoleEnabled === 'Enable' || body.googleSearchConsoleEnabled === true,
        microsoftClarityEnabled: body.microsoftClarityEnabled === 'Enable' || body.microsoftClarityEnabled === true,
        googleRecaptchaEnabled: body.googleRecaptchaEnabled === 'Enable' || body.googleRecaptchaEnabled === true,
        googleLoginEnabled: body.googleLoginEnabled === 'Enable' || body.googleLoginEnabled === true,
        facebookLoginEnabled: body.facebookLoginEnabled === 'Enable' || body.facebookLoginEnabled === true,
        messengerChatEnabled: body.messengerChatEnabled === 'Enable' || body.messengerChatEnabled === true,
        tawkToEnabled: body.tawkToEnabled === 'Enable' || body.tawkToEnabled === true,
        crispChatEnabled: body.crispChatEnabled === 'Enable' || body.crispChatEnabled === true,
    };
    
    const validatedData = updateIntegrationsSchema.parse(parsedBody);
    const result = await IntegrationsServices.createOrUpdateIntegrationsInDB(validatedData);
    
    return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.OK, 
        message: 'Integrations settings updated successfully!', 
        data: result 
    });
};

const getPublicIntegrations = async (_req: NextRequest) => {
    await dbConnect();
    const result = await IntegrationsServices.getPublicIntegrationsFromDB();
    return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.OK, 
        message: 'Integrations retrieved successfully!', 
        data: result 
    });
};

export const IntegrationsController = {
    createOrUpdateIntegrations,
    getPublicIntegrations,
};