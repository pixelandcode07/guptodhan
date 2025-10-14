import { BrandController } from '@/lib/modules/brand/brand.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get a single brand by its ID. (Public)
 * @method GET
 */
export const GET = catchAsync(BrandController.getBrandById);