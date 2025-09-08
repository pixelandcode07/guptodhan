// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\product-model\productModel.service.ts
import { IProductModel } from './productModel.interface';
import { ProductModel } from './productModel.model';
import { Types } from 'mongoose';
import { ClassifiedAd } from '../classifieds/ad.model'; // Dependency check er jonno

const createProductModelInDB = async (payload: Partial<IProductModel>) => {
  const result = await ProductModel.create(payload);
  return result;
};

const getModelsByBrandFromDB = async (brandId: string) => {
    const result = await ProductModel.find({ brand: new Types.ObjectId(brandId), status: 'active' }).sort({ name: 1 });
    return result;
};

// নতুন: মডেল আপডেট করার জন্য
const updateProductModelInDB = async (id: string, payload: Partial<IProductModel>) => {
    const result = await ProductModel.findByIdAndUpdate(id, payload, { new: true });
    if(!result) { throw new Error("Model not found to update."); }
    return result;
};

// নতুন: মডেল ডিলিট করার জন্য
const deleteProductModelFromDB = async (id: string) => {
    const existingAd = await ClassifiedAd.findOne({ productModel: new Types.ObjectId(id) });
    if(existingAd) { throw new Error("Cannot delete this model as it is used in an ad."); }
    
    const result = await ProductModel.findByIdAndDelete(id);
    if(!result) { throw new Error("Model not found to delete."); }
    return null;
};


export const ProductModelServices = {
  createProductModelInDB,
  getModelsByBrandFromDB,
  updateProductModelInDB,
  deleteProductModelFromDB,
};