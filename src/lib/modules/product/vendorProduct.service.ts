import { get } from "http";
import { IVendorProduct } from "./vendorProduct.interface";
import { VendorProductModel } from "./vendorProduct.model";
import { Types } from "mongoose";
import "../product-config/models/brandName.model";

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
  const result = await VendorProductModel.find({ status: "active" }).sort({
    productTitle: 1,
  });
  return result;
};

// Get products by category
const getVendorProductsByCategoryFromDB = async (categoryId: string) => {
  const result = await VendorProductModel.find({
    category: new Types.ObjectId(categoryId),
    status: "active",
  }).sort({ productTitle: 1 });
  return result;
};

// Get products by brand
const getVendorProductsByBrandFromDB = async (brandId: string) => {
  const result = await VendorProductModel.find({
    brand: new Types.ObjectId(brandId),
    status: "active",
  }).sort({ productTitle: 1 });
  return result;
};

// Get vendor product by ID
const getVendorProductByIdFromDB = async (id: string) => {
  const result = await VendorProductModel.findById(id);
  if (!result) {
    throw new Error("Vendor product not found");
  }
  return result;
};

// Update vendor product (including productOptions if provided)
const updateVendorProductInDB = async (
  id: string,
  payload: Partial<IVendorProduct>
) => {
  const result = await VendorProductModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new Error("Vendor product not found to update.");
  }
  return result;
};

// Delete vendor product
const deleteVendorProductFromDB = async (id: string) => {
  const result = await VendorProductModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("Vendor product not found to delete.");
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
    throw new Error("Vendor product not found to add option.");
  }
  return result;
};

// Remove a product option by index
const removeProductOptionFromDB = async (id: string, index: number) => {
  const product = await VendorProductModel.findById(id);
  if (!product) {
    throw new Error("Vendor product not found to remove option.");
  }
  if (
    !product.productOptions ||
    index < 0 ||
    index >= product.productOptions.length
  ) {
    throw new Error("Invalid product option index.");
  }
  product.productOptions.splice(index, 1);
  await product.save();
  return product;
};

// landing page products: running offers, best-selling, and random products
const getLandingPageProductsFromDB = async () => {

  const totalCount = await VendorProductModel.countDocuments({ status: 'active' });
  const randomSkip = Math.floor(Math.random() * Math.max(totalCount - 12, 0));

  
  const [runningOffers, bestSelling, randomProducts] = await Promise.all([
    VendorProductModel.find({
      status: "active",
      offerDeadline: { $gt: new Date() },
    }).sort({ createdAt: -1 }).limit(6),


    VendorProductModel.find({ status: "active" })
      .sort({ sellCount: -1 })
      .limit(6),

    VendorProductModel.find({ status: 'active' })
      .skip(randomSkip)
      .limit(12),
  ]);

  return {
    runningOffers,
    bestSelling,
    randomProducts,
  };
};

// Search vendor products by name (for autocomplete)
const searchVendorProductsFromDB = async (query: string) => {

  const result = await VendorProductModel.find({
    name: { $regex: query, $options: "i" },
    status: "active",
  })
    .select("name image price _id") 
    .limit(10);

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

  getLandingPageProductsFromDB,
  searchVendorProductsFromDB
};
