import {FAQController} from '@/lib/modules/faq/faq.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const GET = catchAsync(FAQController.getAllFAQs);
export const POST = catchAsync(checkRole(["admin"])(FAQController.createFAQ));