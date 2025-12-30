import { IServiceCategory } from "./serviceCategory.interface";
import { ServiceCategoryModel } from "./serviceCategory.model";

// Create service category
const createServiceCategoryInDB = async (
  payload: Partial<IServiceCategory>
) => {
  const maxOrderCategory = await ServiceCategoryModel.findOne()
    .sort({ orderCount: -1 })
    .select('orderCount -_id')
    .lean<{ orderCount: number }>();

  const nextOrder =
    maxOrderCategory && typeof maxOrderCategory.orderCount === 'number'
      ? maxOrderCategory.orderCount + 1
      : 0;

  const result = await ServiceCategoryModel.create({
    ...payload,
    orderCount: nextOrder,
  });

  return result;
};

// Get all service categories
const getAllServiceCategoriesFromDB = async () => {
  const result = await ServiceCategoryModel.find({}).sort({ orderCount: -1 });
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

// rearrange service categories
export const reorderServiceCategoryService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error("orderedIds array is empty");
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    ServiceCategoryModel.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  return { message: "service category reordered successfully!" };
};

export const ServiceCategoryServices = {
  createServiceCategoryInDB,
  getAllServiceCategoriesFromDB,
  getServiceCategoryByIdFromDB,
  getServiceCategoryBySlugFromDB,
  updateServiceCategoryInDB,
  deleteServiceCategoryFromDB,

  reorderServiceCategoryService
};
