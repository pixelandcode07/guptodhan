import { NextRequest } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { updateShippingPolicySchema } from './shipping-policy.validation';
import { ShippingPolicyServices } from './shipping-policy.service';
import dbConnect from '@/lib/db';

const createOrUpdatePolicy = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = updateShippingPolicySchema.parse(body);
    const result = await ShippingPolicyServices.createOrUpdatePolicyInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Shipping Policy updated!', data: result });
};

const getPublicPolicy = async (_req: NextRequest) => {
    await dbConnect();
    const result = await ShippingPolicyServices.getPublicPolicyFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Shipping Policy retrieved!', data: result });
};

export const ShippingPolicyController = {
    createOrUpdatePolicy,
    getPublicPolicy,
};