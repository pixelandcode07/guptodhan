import { IProductFlag } from '../interfaces/productFlag.interface';
import { ProductFlag } from '../models/productFlag.model';
import { ClassifiedAd } from '../../classifieds/ad.model'; // dependency check

// Create new product flag
const createProductFlagInDB = async (payload: Partial<IProductFlag>) => {
  const result = await ProductFlag.create(payload);
  return result;
};

// Get all active product flags
const getAllProductFlagsFromDB = async () => {
  const result = await ProductFlag.find({ status: 'active' }).sort({ name: 1 });
  return result;
};

// Get single product flag by ID
const getProductFlagByIdFromDB = async (id: string) => {
  const result = await ProductFlag.findById(id);
  if (!result) {
    throw new Error('Product flag not found.');
  }
  return result;
};

// Update product flag
const updateProductFlagInDB = async (id: string, payload: Partial<IProductFlag>) => {
  const result = await ProductFlag.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Product flag not found to update.');
  }
  return result;
};

// Delete product flag (only if not used in product models)
const deleteProductFlagFromDB = async (id: string) => {
  const existingModel = await ClassifiedAd.findOne({ flag: id });
  if (existingModel) {
    throw new Error('Cannot delete this product flag as it is used in a product model.');
  }

  const result = await ProductFlag.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Product flag not found to delete.');
  }
  return null;
};

export const ProductFlagServices = {
  createProductFlagInDB,
  getAllProductFlagsFromDB,
  getProductFlagByIdFromDB,
  updateProductFlagInDB,
  deleteProductFlagFromDB,
};
