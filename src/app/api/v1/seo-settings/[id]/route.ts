import { SeoSettingsController } from '@/lib/modules/seo-settings/seo.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Update specific SEO settings by its document ID. (Admin Only)
 * @method PATCH
 */
export const PATCH = catchAsync(checkRole(['admin'])(SeoSettingsController.updateSeoSettings));