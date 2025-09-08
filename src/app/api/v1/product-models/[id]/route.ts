// নতুন ফাইল
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\product-models\[id]\route.ts
import { ProductModelController } from '@/lib/modules/product-model/productModel.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const PATCH = catchAsync(checkRole(['admin'])(ProductModelController.updateProductModel));
export const DELETE = catchAsync(checkRole(['admin'])(ProductModelController.deleteProductModel));