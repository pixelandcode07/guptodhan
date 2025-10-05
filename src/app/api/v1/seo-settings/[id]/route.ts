import { SeoSettingsController } from '@/lib/modules/seo-settings/seo.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const GET = catchAsync(checkRole(['admin'])(SeoSettingsController.getSeoSettingsById));

export const PATCH = catchAsync(checkRole(['admin'])(SeoSettingsController.updateSeoSettings));