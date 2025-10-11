import { FAQCategoryController } from "@/lib/modules/faq-category/faqCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(FAQCategoryController.getAllFAQCategories);
export const POST = catchAsync(FAQCategoryController.createFAQCategory);