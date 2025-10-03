import { AboutContentController } from '@/lib/modules/about-content/content.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Update parts of the 'About Us' page content by its ID. (Admin Only)
 * @method PATCH
 */
export const PATCH = catchAsync(checkRole(['admin'])(AboutContentController.updateContent));