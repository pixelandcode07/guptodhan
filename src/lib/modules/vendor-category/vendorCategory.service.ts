import { IVendorCategory } from './vendorCategory.interface';
import { VendorCategoryModel } from './vendorCategory.model';

// Create vendor category
const createVendorCategoryInDB = async (payload: Partial<IVendorCategory>) => {
  const result = await VendorCategoryModel.create(payload);
  return result;
};

// Get all vendor categories (optional filters: status, searchTerm)
const getAllVendorCategoriesFromDB = async (filters: { status?: string; searchTerm?: string }) => {
  const { status, searchTerm } = filters;
  const query: any = {};

  if (status) {
    query.status = status;
  }

  if (searchTerm) {
    query.name = { $regex: searchTerm, $options: 'i' };
  }

  return await VendorCategoryModel.find(query).sort({ orderCount: 1 });
};

// Get single vendor category by ID
const getSingleVendorCategoryFromDB = async (id: string) => {
  const result = await VendorCategoryModel.findById(id);
  if (!result) {
    throw new Error('Vendor category not found.');
  }
  return result;
};

// Update vendor category
const updateVendorCategoryInDB = async (id: string, payload: Partial<IVendorCategory>) => {
  const result = await VendorCategoryModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Vendor category not found to update.');
  }
  return result;
};

// Delete vendor category
const deleteVendorCategoryFromDB = async (id: string) => {
  const result = await VendorCategoryModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Vendor category not found to delete.');
  }
  return null;
};

// rearrange vendor category 
export const reorderVendorCategoryService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error('orderedIds array is empty');
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    VendorCategoryModel.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );
  

  await Promise.all(updatePromises);

  return { message: 'vendor category reordered successfully!' };
};

export const VendorCategoryServices = {
  createVendorCategoryInDB,
  getAllVendorCategoriesFromDB,
  getSingleVendorCategoryFromDB,
  updateVendorCategoryInDB,
  deleteVendorCategoryFromDB,

  reorderVendorCategoryService
};
