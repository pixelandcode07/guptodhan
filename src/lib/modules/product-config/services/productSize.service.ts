import { IProductSize } from '../interfaces/productSize.interface';
import { ProductSize } from '../models/productSize.model';
import { ClassifiedAd } from '../../classifieds/ad.model'; // dependency check

// Create new product size
const createProductSizeInDB = async (payload: Partial<IProductSize>) => {
  const result = await ProductSize.create(payload);
  return result;
};

// Get all product sizes (filtering handled client-side)
const getAllProductSizesFromDB = async () => {
  const result = await ProductSize.find({}).sort({ orderCount: 1 });
  return result;
};

// Get all active product sizes
const getAllActiveProductSizesFromDB = async () => {
  const result = await ProductSize.find({ status: 'active' }).sort({ orderCount: 1 });
  return result;
}

// Get single product size by ID
const getProductSizeByIdFromDB = async (id: string) => {
  const result = await ProductSize.findById(id);
  if (!result) {
    throw new Error('Product size not found.');
  }
  return result;
};

// Update product size
const updateProductSizeInDB = async (id: string, payload: Partial<IProductSize>) => {
  const result = await ProductSize.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Product size not found to update.');
  }
  return result;
};

// Delete product size (only if not used in product models)
const deleteProductSizeFromDB = async (id: string) => {
  const existingModel = await ClassifiedAd.findOne({ size: id });
  if (existingModel) {
    throw new Error('Cannot delete this size as it is used in a product model.');
  }

  const result = await ProductSize.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Product size not found to delete.');
  }
  return null;
};

// rearrange product sizes 
export const reorderProductSizesService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error('orderedIds array is empty');
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    ProductSize.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  return { message: 'Product sizes reordered successfully!' };
};

export const ProductSizeServices = {
  createProductSizeInDB,
  getAllProductSizesFromDB,
  getAllActiveProductSizesFromDB,
  getProductSizeByIdFromDB,
  updateProductSizeInDB,
  deleteProductSizeFromDB,

  reorderProductSizesService
};
