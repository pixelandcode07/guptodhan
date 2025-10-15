import { NextRequest } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { updateReturnPolicySchema } from './return-policy.validation';
import { ReturnPolicyServices } from './return-policy.service';
import dbConnect from '@/lib/db';

const createOrUpdatePolicy = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = updateReturnPolicySchema.parse(body);
    const result = await ReturnPolicyServices.createOrUpdatePolicyInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Return Policy updated!', data: result });
};

const getPublicPolicy = async (_req: NextRequest) => {
    await dbConnect();
    const result = await ReturnPolicyServices.getPublicPolicyFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Return Policy retrieved!', data: result });
};

export const ReturnPolicyController = {
    createOrUpdatePolicy,
    getPublicPolicy,
};