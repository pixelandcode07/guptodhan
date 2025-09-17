import { IVendorProduct } from './vendorProduct.interface';
import { VendorProductModel } from './vendorProduct.model';
import { Types } from 'mongoose';

// Create vendor product
const createVendorProductInDB = async (payload: Partial<IVendorProduct>) => {
  const result = await VendorProductModel.create(payload);
  return result;
};

// Get all active products (optional: sorted by title)
const getAllVendorProductsFromDB = async () => {
  const result = await VendorProductModel.find({ status: 'active' }).sort({ productTitle: 1 });
  return result;
};

// Get products by category
const getVendorProductsByCategoryFromDB = async (categoryId: string) => {
  const result = await VendorProductModel.find({
    category: new Types.ObjectId(categoryId),
    status: 'active',
  }).sort({ productTitle: 1 });
  return result;
};

// Get products by brand
const getVendorProductsByBrandFromDB = async (brandId: string) => {
  const result = await VendorProductModel.find({
    brand: new Types.ObjectId(brandId),
    status: 'active',
  }).sort({ productTitle: 1 });
  return result;
};

// Update vendor product
const updateVendorProductInDB = async (id: string, payload: Partial<IVendorProduct>) => {
  const result = await VendorProductModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Vendor product not found to update.');
  }
  return result;
};

// Delete vendor product
const deleteVendorProductFromDB = async (id: string) => {
  const result = await VendorProductModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Vendor product not found to delete.');
  }
  return null;
};

export const VendorProductServices = {
  createVendorProductInDB,
  getAllVendorProductsFromDB,
  getVendorProductsByCategoryFromDB,
  getVendorProductsByBrandFromDB,
  updateVendorProductInDB,
  deleteVendorProductFromDB,
};
