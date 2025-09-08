// নতুন ফাইল
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\product-models\route.ts
import { ProductModelController } from '@/lib/modules/product-model/productModel.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// একটি নির্দিষ্ট ব্র্যান্ডের অধীনে থাকা সব মডেল দেখা (পাবলিক)
export const GET = catchAsync(ProductModelController.getModelsByBrand);
// নতুন মডেল তৈরি করা (শুধুমাত্র অ্যাডমিন)
export const POST = catchAsync(checkRole(['admin'])(ProductModelController.createProductModel));