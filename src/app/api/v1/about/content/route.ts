// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\about\content\route.ts
import { AboutContentController } from '@/lib/modules/about-content/content.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
export const POST = catchAsync(checkRole(['admin'])(AboutContentController.createOrUpdateContent));