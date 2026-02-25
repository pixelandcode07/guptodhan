import { BlogController } from '@/lib/modules/blog/blog.controller';
import { BlogServices } from '@/lib/modules/blog/blog.service'; // ✅ service import
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { NextRequest, NextResponse } from 'next/server';

export const GET = catchAsync(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    
    const blog = await BlogServices.getBlogByIdFromDB(id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: blog },
      { status: 200 }
    );
  }
);

export const PATCH = catchAsync(BlogController.updateBlog);
export const DELETE = catchAsync(BlogController.deleteBlog);