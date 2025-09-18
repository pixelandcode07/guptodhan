import { BlogController } from "@/lib/modules/blog/blog.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(BlogController.getAllBlogs);
export const POST = catchAsync(BlogController.createBlog);