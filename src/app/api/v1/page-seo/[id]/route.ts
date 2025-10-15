import { PageSeoController } from '@/lib/modules/page-seo/page-seo.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Update a specific page's SEO information. (Admin Only)
 * @method PATCH
 */
export const PATCH = catchAsync(checkRole(['admin'])(PageSeoController.updatePage));

/**
 * @description Delete a specific page's SEO information. (Admin Only)
 * @method DELETE
 */
export const DELETE = catchAsync(checkRole(['admin'])(PageSeoController.deletePage));