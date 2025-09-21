import {FAQController} from '@/lib/modules/faq/faq.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(FAQController.getAllFAQs);
export const POST = catchAsync(FAQController.createFAQ);