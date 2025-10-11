import { FAQCategoryController } from "@/lib/modules/faq-category/faqCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(FAQCategoryController.updateFAQCategory);

export const DELETE = catchAsync(FAQCategoryController.deleteFAQCategory);