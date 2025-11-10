import { IModelForm } from '../interfaces/modelCreate.interface';
import { ModelForm } from '../models/modelCreate.model';
import { Types } from 'mongoose';
import { ClassifiedAd } from '../../classifieds/ad.model'; // dependency check

// Create new model form
const createModelFormInDB = async (payload: Partial<IModelForm>) => {
  const result = await ModelForm.create(payload);
  return result;
};

// Get all model forms (active and inactive)
const getAllModelFormsFromDB = async () => {
  const result = await ModelForm.find({}).sort({ modelName: 1 });
  return result;
};

// Get all active model forms
const getAllActiveModelFormsFromDB = async () => {
  const result = await ModelForm.find({ status: 'active' }).sort({ modelName: 1 });
  return result;
};

// Get model forms by brand
const getModelFormsByBrandFromDB = async (brandId: string) => {
  const result = await ModelForm.find({
    brand: new Types.ObjectId(brandId),
    status: 'active',
  }).sort({ modelName: 1 });
  return result;
};

// Get single model form by ID
const getModelFormByIdFromDB = async (id: string) => {
  const result = await ModelForm.findById(id);
  if (!result) {
    throw new Error('Model form not found.');
  }
  return result;
};

// Update model form
const updateModelFormInDB = async (id: string, payload: Partial<IModelForm>) => {
  const result = await ModelForm.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Model form not found to update.');
  }
  return result;
};

// Delete model form (only if not used in product models)
const deleteModelFormFromDB = async (id: string) => {
  const existingProductModel = await ClassifiedAd.findOne({ modelForm: new Types.ObjectId(id) });
  if (existingProductModel) {
    throw new Error('Cannot delete this model form as it is used in a product model.');
  }

  const result = await ModelForm.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Model form not found to delete.');
  }
  return null;
};

export const ModelFormServices = {
  createModelFormInDB,
  getAllModelFormsFromDB,
  getAllActiveModelFormsFromDB,
  getModelFormsByBrandFromDB,
  getModelFormByIdFromDB,
  updateModelFormInDB,
  deleteModelFormFromDB,
};
