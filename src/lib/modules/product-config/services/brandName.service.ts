import { IBrand } from '../interfaces/brandName.interface';
import { BrandModel } from '../models/brandName.model';
import { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model';

// Create brand
const createBrandInDB = async (payload: Partial<IBrand>) => {
  const result = await BrandModel.create(payload);
  return result;
};

// Get all brands (active and inactive)
const getAllBrandsFromDB = async () => {
  const result = await BrandModel.find({}).sort({ name: 1 });
  return result;
};

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

export const BrandServices = {
  createBrandInDB,
  getAllBrandsFromDB,
  getBrandsByCategoryFromDB,
  updateBrandInDB,
  deleteBrandFromDB,
};
