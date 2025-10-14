import { EcommerceBannerController } from '@/lib/modules/ecommerce-banner/banner.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
 
export const GET = catchAsync(EcommerceBannerController.getPublicBannersByPosition);