import { IStore } from './vendorStore.interface';
import { StoreModel } from './vendorStore.model';
import { Types } from 'mongoose';
import { ClassifiedAd } from '../classifieds/ad.model';

// Create store
const createStoreInDB = async (payload: Partial<IStore>) => {
  const result = await StoreModel.create(payload);
  return result;
};

// Get all active stores (sorted by storeName)
const getAllStoresFromDB = async () => {
  const result = await StoreModel.find({ status: 'active' }).sort({ storeName: 1 });
  return result;
};

// Get store by ID
const getStoreByIdFromDB = async (id: string) => {
  const result = await StoreModel.findById(new Types.ObjectId(id));
  if (!result) {
    throw new Error('Store not found.');
  }
  return result;
};

// Update store
const updateStoreInDB = async (id: string, payload: Partial<IStore>) => {
  const result = await StoreModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Store not found to update.');
  }
  return result;
};

// Delete store (only if no ads/products exist under it)
const deleteStoreFromDB = async (id: string) => {
  const existingAd = await ClassifiedAd.findOne({ store: new Types.ObjectId(id) });
  if (existingAd) {
    throw new Error('Cannot delete this store as it is linked to existing ads/products.');
  }

  const result = await StoreModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Store not found to delete.');
  }
  return null;
};

export const StoreServices = {
  createStoreInDB,
  getAllStoresFromDB,
  getStoreByIdFromDB,
  updateStoreInDB,
  deleteStoreFromDB,
};
