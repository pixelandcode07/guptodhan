import { ClassifiedCategoryController } from '@/lib/modules/classifieds-category/category.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get a single classified category by its ID. (Public)
 * @method GET
 */
export const GET = catchAsync(ClassifiedCategoryController.getCategoryById);