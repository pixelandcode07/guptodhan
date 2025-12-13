import { IProductFlag } from '../interfaces/productFlag.interface';
import { ProductFlag } from '../models/productFlag.model';
import { ClassifiedAd } from '../../classifieds/ad.model'; // dependency check

// Create new product flag
const createProductFlagInDB = async (payload: Partial<IProductFlag>) => {
  const maxOrderFlag = await ProductFlag.findOne().sort({ orderCount: -1 }).select('orderCount -_id').lean<{ orderCount: number }>();
  console.log("max order flag is :",maxOrderFlag);

  const nextOrder = maxOrderFlag && typeof maxOrderFlag.orderCount === 'number'? maxOrderFlag.orderCount + 1 : 0;
  console.log("next order is :",nextOrder);

  const result = await ProductFlag.create({...payload,orderCount: nextOrder});
  return result;
};

// Get all product flags
const getAllProductFlagsFromDB = async () => {
  const result = await ProductFlag.find({}).sort({ orderCount: 1 });
  return result;
};

// Get all active product flags
const getAllActiveProductFlagsFromDB = async () => {
  const result = await ProductFlag.find({ status: 'active' }).sort({ orderCount: 1 });
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

// rearrange product flags  
export const reorderProductFlagsService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error('orderedIds array is empty');
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    ProductFlag.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  return { message: 'Product flags reordered successfully!' };
};

export const ProductFlagServices = {
  createProductFlagInDB,
  getAllProductFlagsFromDB,
  getAllActiveProductFlagsFromDB,
  getProductFlagByIdFromDB,
  updateProductFlagInDB,
  deleteProductFlagFromDB,

  reorderProductFlagsService
};
