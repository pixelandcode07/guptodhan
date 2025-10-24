import { FAQCategoryController } from "@/lib/modules/faq-category/faqCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import {checkRole} from "@/lib/middlewares/checkRole";

export const GET = catchAsync(FAQCategoryController.getAllFAQCategories);
export const POST = catchAsync(checkRole(["admin"])(FAQCategoryController.createFAQCategory));