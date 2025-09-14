// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\public\services\search\route.ts
import { ServiceController } from '@/lib/modules/service/service.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// পাবলিক রুট: সার্ভিস খোঁজার জন্য
export const GET = catchAsync(ServiceController.searchPublicServices);