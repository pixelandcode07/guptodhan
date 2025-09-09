// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\public\about\content\route.ts
import { AboutContentController } from '@/lib/modules/about-content/content.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
export const GET = catchAsync(AboutContentController.getPublicContent);