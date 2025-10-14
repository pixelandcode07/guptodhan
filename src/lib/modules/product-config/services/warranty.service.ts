import { IProductWarranty } from '../interfaces/warranty.interface';
import { ProductWarrantyModel } from '../models/warranty.model';
import { Types } from 'mongoose';

// Create product warranty
const createProductWarrantyInDB = async (payload: Partial<IProductWarranty>) => {
  const result = await ProductWarrantyModel.create(payload);
  return result;
};

// Get all product warranties (active and inactive)
const getAllProductWarrantiesFromDB = async () => {
  const result = await ProductWarrantyModel.find({}).sort({ warrantyName: 1 });
  return result;
};

// Get active product warranties only
const getActiveProductWarrantiesFromDB = async () => {
  const result = await ProductWarrantyModel.find({ status: 'active' }).sort({ warrantyName: 1 });
  return result;
};

// Update product warranty
const updateProductWarrantyInDB = async (id: string, payload: Partial<IProductWarranty>) => {
  const result = await ProductWarrantyModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error("Product warranty not found to update.");
  }
  return result;
};

// Delete product warranty
const deleteProductWarrantyFromDB = async (id: string) => {
  const result = await ProductWarrantyModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("Product warranty not found to delete.");
  }
  return null;
};

export const ProductWarrantyServices = {
  createProductWarrantyInDB,
  getAllProductWarrantiesFromDB,
  getActiveProductWarrantiesFromDB,
  updateProductWarrantyInDB,
  deleteProductWarrantyFromDB,
};
