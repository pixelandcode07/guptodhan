import { IBlog } from './blog.interface';
import { BlogModel } from './blog.model';
import { Types } from 'mongoose';

// Create blog
const createBlogInDB = async (payload: Partial<IBlog>) => {
  const result = await BlogModel.create(payload);
  return result;
};

// Get all active blogs (optional: sorted by createdAt descending)
const getAllBlogsFromDB = async (filters: {
  category?: string;
  status?: string;
  searchTerm?: string;
}) => {
  const { category, status, searchTerm } = filters;
  const query: any = {};

  if (category) {
    query.category = new Types.ObjectId(category);
  }

  if (status) {
    query.status = status;
  }

  if (searchTerm) {
    query.title = { $regex: searchTerm, $options: 'i' }; // Case-insensitive title search
  }

  return await BlogModel.find(query)
    .populate('category', 'name') // Shows the category name
    .sort({ createdAt: -1 });
};

// Get blogs by category
const getBlogsByCategoryFromDB = async (categoryId: string) => {
  const result = await BlogModel.find({
    category: new Types.ObjectId(categoryId),
    status: 'active',
  }).sort({ createdAt: -1 });
  return result;
};

// Update blog
const updateBlogInDB = async (id: string, payload: Partial<IBlog>) => {
  const result = await BlogModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Blog not found to update.');
  }
  return result;
};

// Delete blog
const deleteBlogFromDB = async (id: string) => {
  const result = await BlogModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Blog not found to delete.');
  }
  return null;
};

const getBlogByIdFromDB = async (id: string) => {
  const result = await BlogModel.findById(id);
  return result;
};

export const BlogServices = {
  createBlogInDB,
  getAllBlogsFromDB,
  getBlogsByCategoryFromDB,
  updateBlogInDB,
  deleteBlogFromDB,
  getBlogByIdFromDB,
};
