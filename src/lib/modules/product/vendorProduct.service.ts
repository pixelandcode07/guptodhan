import { get } from 'http';
import { IVendorProduct } from './vendorProduct.interface';
import { VendorProductModel } from './vendorProduct.model';
import { Types } from 'mongoose';

// Create vendor product
const createVendorProductInDB = async (payload: Partial<IVendorProduct>) => {
  const result = await VendorProductModel.create(payload);
  return result;
};

// Get all products (both active and inactive) - used for sidebar count
const getAllVendorProductsFromDB = async () => {
  const result = await VendorProductModel.find({}).sort({ productTitle: 1 });
  return result;
};

// Get only active products - used for product listing pages
const getActiveVendorProductsFromDB = async () => {
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

// Get vendor product by ID
const getVendorProductByIdFromDB = async (id: string) => {
  const result = await VendorProductModel.findById(id);
  if (!result) {
    throw new Error('Vendor product not found');
  }
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


// Get 6 products with running offers 
const getRunningOffersFromDB = async () => {
  const result = await VendorProductModel.aggregate([
    {
      $match: {
        status: 'active',
        offerDeadline: { $gt: new Date() },
      },
    },
    { $sample: { size: 6 } },
  ]);
  return result;
};

// Get 6 best-selling products (highest sellCount)
const getBestSellingProductsFromDB = async () => {
  const result = await VendorProductModel.find({ status: 'active' })
    .sort({ sellCount: -1 })
    .limit(6);
  return result;
};

// ✅ Get 12 random active products
const getRandomProductsFromDB = async () => {
  const result = await VendorProductModel.aggregate([
    { $match: { status: 'active' } },
    { $sample: { size: 12 } },
  ]);
  return result;
};


export const VendorProductServices = {
  createVendorProductInDB,
  getAllVendorProductsFromDB,
  getActiveVendorProductsFromDB,
  getVendorProductByIdFromDB,
  getVendorProductsByCategoryFromDB,
  getVendorProductsByBrandFromDB,
  updateVendorProductInDB,
  deleteVendorProductFromDB,
  addProductOptionInDB,
  removeProductOptionFromDB,

  getRunningOffersFromDB,
  getBestSellingProductsFromDB,
  getRandomProductsFromDB,
};
