import { BlogController } from '@/lib/modules/blog/blog.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    const blogs = await BlogController.getAllBlogs(req); // optional, or create a getBlogById
    const blog = blogs.data.find((b: any) => b._id === id);
    if (!blog) throw new Error('Blog not found');
    return {
      status: 200,
      body: blog,
    };
  }
);

export const PATCH = catchAsync(BlogController.updateBlog);
export const DELETE = catchAsync(BlogController.deleteBlog);
