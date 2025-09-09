// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\about\facts\route.ts
import { AboutFactController } from '@/lib/modules/about-fact/fact.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// এই রুটটি এখন আর পাবলিক নয়, কারণ পাবলিক রুট আলাদা
export const POST = catchAsync(checkRole(['admin'])(AboutFactController.createFact));