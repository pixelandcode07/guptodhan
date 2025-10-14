// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\about\cta\route.ts
import { AboutCtaController } from '@/lib/modules/about-cta/cta.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
export const POST = catchAsync(checkRole(['admin'])(AboutCtaController.createCta));