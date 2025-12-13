import { FAQController } from "@/lib/modules/faq/faq.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(FAQController.updateFAQ));
export const DELETE = catchAsync(checkRole(["admin"])(FAQController.deleteFAQ));