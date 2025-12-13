import { FAQCategoryController } from "@/lib/modules/faq-category/faqCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import {checkRole} from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(FAQCategoryController.updateFAQCategory));
export const DELETE = catchAsync(checkRole(["admin"])(FAQCategoryController.deleteFAQCategory));