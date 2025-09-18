import { BlogController } from "@/lib/modules/blog/blog.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(BlogController.getBlogsByCategory);
export const PATCH = catchAsync(BlogController.updateBlog);
export const DELETE = catchAsync(BlogController.deleteBlog);