import { IProductColor } from '../interfaces/productColor.interface';
import { ProductColor } from '../models/productColor.model';
import { ClassifiedAd } from '../../classifieds/ad.model'; // dependency check

// Create new product color
const createProductColorInDB = async (payload: Partial<IProductColor>) => {
  const result = await ProductColor.create(payload);
  return result;
};

// Get all active product colors
const getAllProductColorsFromDB = async () => {
  const result = await ProductColor.find({ status: 'active' }).sort({ colorName: 1 });
  return result;
};

// Get single product color by ID
const getProductColorByIdFromDB = async (id: string) => {
  const result = await ProductColor.findById(id);
  if (!result) {
    throw new Error('Product color not found.');
  }
  return result;
};

// Update product color
const updateProductColorInDB = async (id: string, payload: Partial<IProductColor>) => {
  const result = await ProductColor.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Product color not found to update.');
  }
  return result;
};

// Delete product color (only if not used in product models)
const deleteProductColorFromDB = async (id: string) => {
  const existingModel = await ClassifiedAd.findOne({ color: id });
  if (existingModel) {
    throw new Error('Cannot delete this color as it is used in a product model.');
  }

  const result = await ProductColor.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Product color not found to delete.');
  }
  return null;
};

export const ProductColorServices = {
  createProductColorInDB,
  getAllProductColorsFromDB,
  getProductColorByIdFromDB,
  updateProductColorInDB,
  deleteProductColorFromDB,
};
