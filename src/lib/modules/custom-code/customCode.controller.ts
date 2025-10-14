// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\custom-code\customCode.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { updateCustomCodeSchema } from './customCode.validation';
import { CustomCodeServices } from './customCode.service';
import dbConnect from '@/lib/db';

const createOrUpdateCode = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = updateCustomCodeSchema.parse(body);
    const result = await CustomCodeServices.createOrUpdateCodeInDB(validatedData);
    
    return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.OK, 
        message: 'Custom CSS & JS updated successfully!', 
        data: result 
    });
};

const getPublicCode = async (_req: NextRequest) => {
    await dbConnect();
    const result = await CustomCodeServices.getPublicCodeFromDB();
    return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.OK, 
        message: 'Custom code retrieved successfully!', 
        data: result 
    });
};

const deleteCode = async (_req: NextRequest) => {
    await dbConnect();
    await CustomCodeServices.deleteCodeFromDB();
    return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.OK, 
        message: 'Custom code deleted successfully!', 
        data: null 
    });
};


export const CustomCodeController = {
    createOrUpdateCode,
    getPublicCode,
    deleteCode,
};