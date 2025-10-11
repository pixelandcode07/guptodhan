// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\about\cta\[id]\route.ts
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
import { AboutCtaController } from '@/lib/modules/about-cta/cta.controller';
export const PATCH = catchAsync(checkRole(['admin'])(AboutCtaController.updateCta));