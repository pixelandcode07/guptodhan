import { IBlogCategory } from './blogCategory.interface';
import { BlogCategoryModel } from './blogCategory.model';

// Create blog category
const createBlogCategoryInDB = async (payload: Partial<IBlogCategory>) => {
  const result = await BlogCategoryModel.create(payload);
  return result;
};

// Get all blog categories (optional filters: status, searchTerm)
const getAllBlogCategoriesFromDB = async () => {
  return BlogCategoryModel.find().sort({ createdAt: -1 });
};

// Get all active blog categories
const getAllActiveBlogCategoriesFromDB = async () => {
  return BlogCategoryModel.find({ status: 'active' }).sort({ createdAt: -1 });
};


// Get single blog category by ID
const getSingleBlogCategoryFromDB = async (id: string) => {
  const result = await BlogCategoryModel.findById(id);
  if (!result) {
    throw new Error('Blog category not found.');
  }
  return result;
};

// Update blog category
const updateBlogCategoryInDB = async (id: string, payload: Partial<IBlogCategory>) => {
  const result = await BlogCategoryModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Blog category not found to update.');
  }
  return result;
};

// Delete blog category
const deleteBlogCategoryFromDB = async (id: string) => {
  const result = await BlogCategoryModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Blog category not found to delete.');
  }
  return null;
};

export const BlogCategoryServices = {
  createBlogCategoryInDB,
  getAllBlogCategoriesFromDB,
  getAllActiveBlogCategoriesFromDB,
  getSingleBlogCategoryFromDB,
  updateBlogCategoryInDB,
  deleteBlogCategoryFromDB,
};
