import { IStorageType } from '../interfaces/storageType.interface';
import { StorageType } from '../models/storageType.model';
import { ClassifiedAd } from '../../classifieds/ad.model'; // dependency check

// Create new storage type
const createStorageTypeInDB = async (payload: Partial<IStorageType>) => {
  const result = await StorageType.create(payload);
  return result;
};

// Get all storage types (filtering handled client-side)
const getAllStorageTypesFromDB = async () => {
  const result = await StorageType.find({}).sort({ orderCount: 1 });
  return result;
};

// Get all storage types with 'active' status
const getAllActiveStorageTypesFromDB = async () => {
  const result = await StorageType.find({ status: 'active' }).sort({ orderCount: 1 });
  return result;
};

// Get single storage type by ID
const getStorageTypeByIdFromDB = async (id: string) => {
  const result = await StorageType.findById(id);
  if (!result) {
    throw new Error('Storage type not found.');
  }
  return result;
};

// Update storage type
const updateStorageTypeInDB = async (id: string, payload: Partial<IStorageType>) => {
  const result = await StorageType.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Storage type not found to update.');
  }
  return result;
};

// Delete storage type (only if not used in product models)
const deleteStorageTypeFromDB = async (id: string) => {
  const existingModel = await ClassifiedAd.findOne({ storageType: id });
  if (existingModel) {
    throw new Error('Cannot delete this storage type as it is used in a product model.');
  }

  const result = await StorageType.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Storage type not found to delete.');
  }
  return null;
};

// rearrange storage types 
export const reorderStorageTypesService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error('orderedIds array is empty');
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    StorageType.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  return { message: 'Storage types reordered successfully!' };
};

export const StorageTypeServices = {
  createStorageTypeInDB,
  getAllStorageTypesFromDB,
  getAllActiveStorageTypesFromDB,
  getStorageTypeByIdFromDB,
  updateStorageTypeInDB,
  deleteStorageTypeFromDB,

  reorderStorageTypesService
};
