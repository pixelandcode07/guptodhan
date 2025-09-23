import { FAQController } from "@/lib/modules/faq/faq.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(FAQController.updateFAQ);
export const DELETE = catchAsync(FAQController.deleteFAQ);