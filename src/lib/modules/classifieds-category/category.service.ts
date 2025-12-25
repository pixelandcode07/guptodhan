
import { Types } from 'mongoose';
import { ClassifiedSubCategory } from '../classifieds-subcategory/subcategory.model';
import { ClassifiedAd } from '../classifieds/ad.model';
import { IClassifiedCategory } from './category.interface';
import { ClassifiedCategory } from './category.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createCategoryInDB = async (payload: Partial<IClassifiedCategory>) => {
  const result = await ClassifiedCategory.create(payload);
  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await ClassifiedCategory.find().sort({orderCount:1}); // { status: 'active' }
  return result;
};

const getPublicCategoriesFromDB = async () => {
  const result = await ClassifiedCategory.find({ status: 'active' }).sort({
    orderCount: 1,
  });
  return result;
};

const updateCategoryInDB = async (
  id: string,
  payload: Partial<IClassifiedCategory>
) => {
  const result = await ClassifiedCategory.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const categoryId = new Types.ObjectId(id);

  // Step 1: Find all sub-categories that belong to this parent category
  const subCategoriesToDelete = await ClassifiedSubCategory.find({ category: categoryId });

  // Step 2 (Optional but Recommended): Check if any of those sub-categories are in use by an ad
  const subCategoryIds = subCategoriesToDelete.map(sub => sub._id);
  const adUsingSubCategory = await ClassifiedAd.findOne({ subCategory: { $in: subCategoryIds } });
  if (adUsingSubCategory) {
    throw new Error("Cannot delete: One of its sub-categories is currently in use by an ad.");
  }

  // Step 3: Delete the sub-categories
  await ClassifiedSubCategory.deleteMany({ category: categoryId });

  // Step 4: Delete the parent category's icon from Cloudinary
  const category = await ClassifiedCategory.findById(categoryId);
  if (!category) { throw new Error("Category not found"); }
  if (category.icon) {
    await deleteFromCloudinary(category.icon);
  }

  // Step 5: Finally, delete the parent category itself
  await ClassifiedCategory.findByIdAndDelete(categoryId);

  return null;
};

const getCategoriesWithSubcategoriesFromDB = async () => {
  const result = await ClassifiedCategory.aggregate([
    // {
    //   $match: { status: 'active' }
    // },
    {
      $lookup: {
        from: 'classifiedsubcategories', // সাব-ক্যাটাগরি মডেলের কালেকশনের নাম (Mongoose এটিকে plural করে)
        localField: '_id',
        foreignField: 'category',
        as: 'subCategories',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        icon: 1,
        status: 1, // For getting status in frontend
        'subCategories._id': 1,
        'subCategories.name': 1,
        'subCategories.category': 1, // Parent category ID
        'subCategories.icon': 1, // Optional for icon
        'subCategories.status': 1, // Include status for frontend filter
      }
    },

    {
      $sort: { name: 1 },
    },
  ]);

  return result;
};

const getCategoryByIdFromDB = async (id: string) => {
  const result = await ClassifiedCategory.findById(id);
  if (!result) {
    throw new Error('Category not found');
  }
  return result;
};


// ✅ getPublicCategoriesWithCountsFromDB
const getPublicCategoriesWithCountsFromDB = async (categoryId?: string) => {
  try {
    const matchStage: any = { status: 'active', orderCount: 1 };

    if (categoryId) {
      matchStage._id = new Types.ObjectId(categoryId);
    }

    const categoriesWithCounts = await ClassifiedCategory.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'classifiedads',
          localField: '_id',
          foreignField: 'category',
          pipeline: [{ $match: { status: 'active' } }],
          as: 'ads',
        },
      },
      {
        $addFields: {
          adCount: { $size: '$ads' },
        },
      },
      {
        $project: {
          name: 1,
          icon: 1,
          status: 1,
          adCount: 1,
          ads: 1, 
        },
      },
    ]);

    return categoriesWithCounts;
  } catch (error) {
    console.error('Error fetching categories with ad counts:', error);
    return [];
  }
};

const searchAdsInDB = async (filters: Record<string, any>) => {
  const query: Record<string, any> = { status: 'active' };

  // --- Location Filters ---
  if (filters.division) query.division = new RegExp(`^${filters.division}$`, 'i');
  if (filters.district) query.district = new RegExp(`^${filters.district}$`, 'i');
  if (filters.upazila) query.upazila = new RegExp(`^${filters.upazila}$`, 'i');

  // --- Category & Brand Filters ---
  if (filters.category) query.category = new Types.ObjectId(filters.category);
  if (filters.subCategory) query.subCategory = new Types.ObjectId(filters.subCategory);
  if (filters.brand) query.brand = new Types.ObjectId(filters.brand);

  // --- Price Range Filter ---
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }
  
  console.log("Final Query:", query); // For debugging

  return await ClassifiedAd.find(query)
    .populate('user', 'name profilePicture')
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .populate('brand', 'name logo')
    .sort({ createdAt: -1 });
};

// rearrange buy and sell category
export const reorderClassifiedCategoryService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error('orderedIds array is empty');
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    ClassifiedCategory.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  return { message: 'buy and sell / classified reordered successfully!' };
};

export const ClassifiedCategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  getCategoriesWithSubcategoriesFromDB,
  getPublicCategoriesFromDB,
  getCategoryByIdFromDB,
  getPublicCategoriesWithCountsFromDB,
  searchAdsInDB,

  reorderClassifiedCategoryService
};
