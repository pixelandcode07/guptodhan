import { IServiceCategory } from "./serviceCategory.interface";
import { ServiceCategoryModel } from "./serviceCategory.model";

// Create service category
const createServiceCategoryInDB = async (payload: Partial<IServiceCategory>) => {
  const result = await ServiceCategoryModel.create(payload);
  return result;
};

// Get all service categories
const getAllServiceCategoriesFromDB = async () => {
  const result = await ServiceCategoryModel.find({}).sort({ name: 1 });
  return result;
};

// Get single category by ID
const getServiceCategoryByIdFromDB = async (id: string) => {
  const result = await ServiceCategoryModel.findById(id);
  return result;
};

// Get single category by slug
const getServiceCategoryBySlugFromDB = async (slug: string) => {
  const result = await ServiceCategoryModel.findOne({ slug });
  return result;
};

// Update service category
const updateServiceCategoryInDB = async (id: string, payload: Partial<IServiceCategory>) => {
  const result = await ServiceCategoryModel.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new Error("Service Category not found to update.");
  }

  return result;
};

// Delete service category
const deleteServiceCategoryFromDB = async (id: string) => {
  const result = await ServiceCategoryModel.findByIdAndDelete(id);

  if (!result) {
    throw new Error("Service Category not found to delete.");
  }

  return null;
};

export const ServiceCategoryServices = {
  createServiceCategoryInDB,
  getAllServiceCategoriesFromDB,
  getServiceCategoryByIdFromDB,
  getServiceCategoryBySlugFromDB,
  updateServiceCategoryInDB,
  deleteServiceCategoryFromDB,
};
