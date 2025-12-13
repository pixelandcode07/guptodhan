import { NextRequest } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { updateSocialLinksSchema } from './social-links.validation';
import { SocialLinksServices } from './social-links.service';
import dbConnect from '@/lib/db';

const createOrUpdateSocialLinks = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = updateSocialLinksSchema.parse(body);
    const result = await SocialLinksServices.createOrUpdateSocialLinksInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Social links updated!', data: result });
};

const getPublicSocialLinks = async (_req: NextRequest) => {
    await dbConnect();
    const result = await SocialLinksServices.getPublicSocialLinksFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Social links retrieved!', data: result });
};

export const SocialLinksController = {
    createOrUpdateSocialLinks,
    getPublicSocialLinks,
};