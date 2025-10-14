import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createBlogValidationSchema, updateBlogValidationSchema } from './blog.validation';
import { BlogServices } from './blog.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

// Create a new blog
const createBlog = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createBlogValidationSchema.parse(body);

    const payload = {
        ...validatedData,
    };

    const result = await BlogServices.createBlogInDB(payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Blog created successfully!',
        data: result,
    });
};

// Get all blogs
const getAllBlogs = async (req: NextRequest) => {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // Extract query parameters from the URL
    const filters = {
        category: searchParams.get('category') || undefined,
        status: searchParams.get('status') || undefined,
        searchTerm: searchParams.get('searchTerm') || undefined,
    };
    
    const result = await BlogServices.getAllBlogsFromDB(filters);
    
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Blogs retrieved successfully!',
        data: result,
    });
};


// Get blogs by category
const getBlogsByCategory = async (_req: NextRequest, { params }: { params: { categoryId: string } }) => {
    await dbConnect();
    const { categoryId } = params;
    const result = await BlogServices.getBlogsByCategoryFromDB(categoryId);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Blogs retrieved successfully by category!',
        data: result,
    });
};

// Update blog
const updateBlog = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateBlogValidationSchema.parse(body);

    console.log('Validated Data:', validatedData);
    console.log('Blog ID:', id);

    const payload = {
        ...validatedData,
        // ...(validatedData.category && { category: new Types.ObjectId(validatedData.category) }),
    };

    const result = await BlogServices.updateBlogInDB(id, payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Blog updated successfully!',
        data: result,
    });
};

// Delete blog
const deleteBlog = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await BlogServices.deleteBlogFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Blog deleted successfully!',
        data: null,
    });
};

export const BlogController = {
    createBlog,
    getAllBlogs,
    getBlogsByCategory,
    updateBlog,
    deleteBlog,
};
