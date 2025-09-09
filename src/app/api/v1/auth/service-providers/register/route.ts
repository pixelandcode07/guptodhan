// নতুন ফাইল
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\service-providers\register\route.ts

import { ServiceProviderController } from '@/lib/modules/service-provider/serviceProvider.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// এই রুটটি পাবলিক থাকবে
export const POST = catchAsync(ServiceProviderController.registerServiceProvider);