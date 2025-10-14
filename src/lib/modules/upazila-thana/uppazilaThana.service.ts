import { IUpazilaThana } from './upazilaThana.interface';
import { UpazilaThanaModel } from './upazilaThana.model';
import { Types } from 'mongoose';

// Create Upazila/Thana
const createUpazilaThanaInDB = async (payload: Partial<IUpazilaThana>) => {
  const result = await UpazilaThanaModel.create(payload);
  return result;
};

// Get all Upazilas/Thanas
const getAllUpazilaThanasFromDB = async () => {
  const result = await UpazilaThanaModel.find().sort({ createdAt: -1 });
  return result;
};

// Get Upazilas/Thanas by district
const getUpazilaThanasByDistrictFromDB = async (district: string) => {
  const result = await UpazilaThanaModel.find({ district }).sort({ createdAt: -1 });
  return result;
};


// Update Upazila/Thana
const updateUpazilaThanaInDB = async (
  id: string,
  payload: Partial<IUpazilaThana>
) => {
  const result = await UpazilaThanaModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new Error('Upazila/Thana not found to update.');
  }
  return result;
};

// Delete Upazila/Thana
const deleteUpazilaThanaFromDB = async (id: string) => {
  const result = await UpazilaThanaModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Upazila/Thana not found to delete.');
  }
  return null;
};

export const UpazilaThanaServices = {
  createUpazilaThanaInDB,
  getAllUpazilaThanasFromDB,
  getUpazilaThanasByDistrictFromDB,
  updateUpazilaThanaInDB,
  deleteUpazilaThanaFromDB,
};
