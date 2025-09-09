// নতুন ফাইল: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\about\facts\[id]\route.ts
import { AboutFactController } from '@/lib/modules/about-fact/fact.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const PATCH = catchAsync(checkRole(['admin'])(AboutFactController.updateFact));
export const DELETE = catchAsync(checkRole(['admin'])(AboutFactController.deleteFact));