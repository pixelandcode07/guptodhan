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

// Update vendor product (including productOptions if provided)
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

// Add a new product option to an existing product
const addProductOptionInDB = async (id: string, option: any) => {
  const result = await VendorProductModel.findByIdAndUpdate(
    id,
    { $push: { productOptions: option } },
    { new: true }
  );
  if (!result) {
    throw new Error('Vendor product not found to add option.');
  }
  return result;
};

// Remove a product option by index
const removeProductOptionFromDB = async (id: string, index: number) => {
  const product = await VendorProductModel.findById(id);
  if (!product) {
    throw new Error('Vendor product not found to remove option.');
  }
  if (!product.productOptions || index < 0 || index >= product.productOptions.length) {
    throw new Error('Invalid product option index.');
  }
  product.productOptions.splice(index, 1);
  await product.save();
  return product;
};

export const VendorProductServices = {
  createVendorProductInDB,
  getAllVendorProductsFromDB,
  getVendorProductsByCategoryFromDB,
  getVendorProductsByBrandFromDB,
  updateVendorProductInDB,
  deleteVendorProductFromDB,
  addProductOptionInDB,
  removeProductOptionFromDB,
};
