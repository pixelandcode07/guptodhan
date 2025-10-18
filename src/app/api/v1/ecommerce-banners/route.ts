import { EcommerceBannerController } from '@/lib/modules/ecommerce-banner/banner.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const POST = catchAsync(checkRole(['admin'])(EcommerceBannerController.createBanner));
export const GET = catchAsync(checkRole(['admin'])(EcommerceBannerController.getAllBanners)); 