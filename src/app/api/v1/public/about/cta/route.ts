// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\public\about\cta\route.ts
import { AboutCtaController } from '@/lib/modules/about-cta/cta.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
export const GET = catchAsync(AboutCtaController.getPublicCta);