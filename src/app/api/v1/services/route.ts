// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\services\route.ts
import { ServiceController } from '@/lib/modules/service/service.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// সার্ভিস তৈরি করা (শুধুমাত্র 'service-provider' রা পারবে)
export const POST = catchAsync(checkRole(['service-provider'])(ServiceController.createService));