import { IProductColor } from '../interfaces/productColor.interface';
import { ProductColor } from '../models/productColor.model';
import { ClassifiedAd } from '../../classifieds/ad.model';

const createProductColorInDB = async (payload: Partial<IProductColor>) => {
  const result = await ProductColor.create(payload);
  return result;
};

const getAllProductColorsFromDB = async () => {
  const result = await ProductColor.find({}).sort({ colorName: 1 });
  return result;
};

const getAllActiveProductColorsFromDB = async () => {
  const result = await ProductColor.find({ status: 'active' }).sort({ colorName: 1 });
  return result;
}

const getProductColorByIdFromDB = async (id: string) => {
  const result = await ProductColor.findById(id);
  if (!result) {
    throw new Error('Product color not found.');
  }
  return result;
};

const updateProductColorInDB = async (id: string, payload: Partial<IProductColor>) => {
  const result = await ProductColor.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Product color not found to update.');
  }
  return result;
};

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
  getAllActiveProductColorsFromDB,
  getProductColorByIdFromDB,
  updateProductColorInDB,
  deleteProductColorFromDB,
};
