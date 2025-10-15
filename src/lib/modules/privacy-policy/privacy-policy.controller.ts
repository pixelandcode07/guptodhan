import { NextRequest } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { updatePrivacyPolicySchema } from './privacy-policy.validation';
import { PrivacyPolicyServices } from './privacy-policy.service';
import dbConnect from '@/lib/db';

const createOrUpdatePolicy = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = updatePrivacyPolicySchema.parse(body);
    const result = await PrivacyPolicyServices.createOrUpdatePolicyInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Privacy Policy updated!', data: result });
};

const getPublicPolicy = async (_req: NextRequest) => {
    await dbConnect();
    const result = await PrivacyPolicyServices.getPublicPolicyFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Privacy Policy retrieved!', data: result });
};

export const PrivacyPolicyController = {
    createOrUpdatePolicy,
    getPublicPolicy,
};