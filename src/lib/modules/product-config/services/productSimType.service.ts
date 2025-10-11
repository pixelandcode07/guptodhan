import { IProductSimType } from '../interfaces/productSimType.interface';
import { ProductSimTypeModel } from '../models/productSimType.model';

// Create SIM Type
const createProductSimTypeInDB = async (payload: Partial<IProductSimType>) => {
  const result = await ProductSimTypeModel.create(payload);
  return result;
};

// Get all SIM Types (active and inactive)
const getAllProductSimTypesFromDB = async () => {
  const result = await ProductSimTypeModel.find({}).sort({ name: 1 });
  return result;
};

// Get only active SIM Types
const getActiveProductSimTypesFromDB = async () => {
  const result = await ProductSimTypeModel.find({ status: 'active' }).sort({ name: 1 });
  return result;
};

// Update SIM Type
const updateProductSimTypeInDB = async (id: string, payload: Partial<IProductSimType>) => {
  const result = await ProductSimTypeModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('SIM Type not found to update.');
  }
  return result;
};

// Delete SIM Type
const deleteProductSimTypeFromDB = async (id: string) => {
  const result = await ProductSimTypeModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('SIM Type not found to delete.');
  }
  return null;
};

export const ProductSimTypeServices = {
  createProductSimTypeInDB,
  getAllProductSimTypesFromDB,
  getActiveProductSimTypesFromDB,
  updateProductSimTypeInDB,
  deleteProductSimTypeFromDB,
};
