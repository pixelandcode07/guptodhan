import { EcommerceBannerController } from '@/lib/modules/ecommerce-banner/banner.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const PATCH = catchAsync(checkRole(['admin'])(EcommerceBannerController.updateBanner));
export const DELETE = catchAsync(checkRole(['admin'])(EcommerceBannerController.deleteBanner)); 