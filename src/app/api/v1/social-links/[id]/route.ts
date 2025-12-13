import { SocialLinkController } from '@/lib/modules/social-link/socialLink.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Get a single social link by ID. (Admin Only)
 * @method GET
 */
export const GET = catchAsync(checkRole(['admin'])(SocialLinkController.getSocialLinkById));

// Your existing PATCH and DELETE methods
export const PATCH = catchAsync(checkRole(['admin'])(SocialLinkController.updateSocialLink));
export const DELETE = catchAsync(checkRole(['admin'])(SocialLinkController.deleteSocialLink));