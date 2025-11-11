import { IBrand } from '../interfaces/brandName.interface';
import { BrandModel } from '../models/brandName.model';
import { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model';

// Create brand
const createBrandInDB = async (payload: Partial<IBrand>) => {
  const maxOrderBrand = await BrandModel.findOne().sort({ order: -1 }).select('order');
  const nextOrder = maxOrderBrand ? maxOrderBrand.order + 1 : 0;

  const result = await BrandModel.create({ ...payload, order: nextOrder });
  return result;
};

// Get all brands (active and inactive)
const getAllBrandsFromDB = async () => {
  const result = await BrandModel.find({}).sort({ orderCount: 1 });
  return result;
};

// Get all active brands by category
const getAllActiveBrandsName = async ()=>{
  const result = await BrandModel.find({status: 'active'}).sort({ orderCount: 1 });
  return result;
}

// Get brands by category
const getBrandsByCategoryFromDB = async (categoryId: string) => {
  const result = await BrandModel.find({ 
    category: categoryId, 
    status: 'active' 
  }).sort({ name: 1 });
  return result;
};

// Update brand
const updateBrandInDB = async (id: string, payload: Partial<IBrand>) => {
  const result = await BrandModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error("Brand not found to update.");
  }
  return result;
};

// Delete brand (only if no models exist under it)
const deleteBrandFromDB = async (id: string) => {
  const existingModel = await ClassifiedAd.findOne({ brand: new Types.ObjectId(id) });
  if (existingModel) {
    throw new Error("Cannot delete this brand as it is used in a product model.");
  }

  const result = await BrandModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("Brand not found to delete.");
  }
  return null;
};

// rearrange brands name 
export const reorderBrandNamesService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error('orderedIds array is empty');
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    BrandModel.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  return { message: 'Brand names reordered successfully!' };
};

export const BrandServices = {
  createBrandInDB,
  getAllBrandsFromDB,
  getAllActiveBrandsName
  getBrandsByCategoryFromDB,
  updateBrandInDB,
  deleteBrandFromDB,

  reorderBrandNamesService
};
