import { SocialLinksController } from '@/lib/modules/social-links/social-links.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Create or update social media links. (Admin Only)
 * @method POST
 */
export const POST = catchAsync(checkRole(['admin'])(SocialLinksController.createOrUpdateSocialLinks));