
import { IBrand } from './brand.interface';
import { Brand } from './brand.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createBrandInDB = async (payload: Partial<IBrand>) => {
  const result = await Brand.create(payload);
  return result;
};

const getAllBrandsFromDB = async () => {
  const result = await Brand.find({ status: 'active' }).sort({ name: 1 });
  return result;
};

const updateBrandInDB = async (id: string, payload: Partial<IBrand>) => {
  const result = await Brand.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error("Brand not found to update.");
  }
  return result;
};

const deleteBrandFromDB = async (id: string) => {
    const brand = await Brand.findById(id);
    if (!brand) { throw new Error("Brand not found"); }
    
    if (brand.logo) {
        await deleteFromCloudinary(brand.logo);
    }
    
    await Brand.findByIdAndDelete(id);
    return null;
};

export const BrandServices = {
  createBrandInDB,
  getAllBrandsFromDB,
  updateBrandInDB,
  deleteBrandFromDB,
};