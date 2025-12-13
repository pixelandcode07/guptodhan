import { BlogCategoryController } from "@/lib/modules/blog-category/blogCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";


export const GET = catchAsync(BlogCategoryController.getAllBlogCategories);
export const POST = catchAsync(checkRole(["admin"])(BlogCategoryController.createBlogCategory));