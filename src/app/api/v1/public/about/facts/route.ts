// নতুন ফাইল: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\public\about\facts\route.ts
import { AboutFactController } from '@/lib/modules/about-fact/fact.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(AboutFactController.getPublicFacts);