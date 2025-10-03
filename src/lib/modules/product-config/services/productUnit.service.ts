import { IProductUnit } from '../interfaces/productUnit.interface';
import { ProductUnit } from '../models/productUnit.model';
import { ClassifiedAd } from '../../classifieds/ad.model'; // dependency check

// Create new product unit
const createProductUnitInDB = async (payload: Partial<IProductUnit>) => {
  const result = await ProductUnit.create(payload);
  return result;
};

// Get all product units (active and inactive)
const getAllProductUnitsFromDB = async () => {
  const result = await ProductUnit.find({}).sort({ name: 1 });
  return result;
};

// Get single product unit by ID
const getProductUnitByIdFromDB = async (id: string) => {
  const result = await ProductUnit.findById(id);
  if (!result) {
    throw new Error('Product unit not found.');
  }
  return result;
};

// Update product unit
const updateProductUnitInDB = async (id: string, payload: Partial<IProductUnit>) => {
  const result = await ProductUnit.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Product unit not found to update.');
  }
  return result;
};

// Delete product unit (only if not used in product models)
const deleteProductUnitFromDB = async (id: string) => {
  const existingModel = await ClassifiedAd.findOne({ unit: id });
  if (existingModel) {
    throw new Error('Cannot delete this unit as it is used in a product model.');
  }

  const result = await ProductUnit.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Product unit not found to delete.');
  }
  return null;
};

export const ProductUnitServices = {
  createProductUnitInDB,
  getAllProductUnitsFromDB,
  getProductUnitByIdFromDB,
  updateProductUnitInDB,
  deleteProductUnitFromDB,
};
