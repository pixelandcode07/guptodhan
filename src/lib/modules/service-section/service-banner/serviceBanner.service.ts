import { ServiceBanner } from './serviceBanner.model';

// Create service banner
const createServiceBannerInDB = async (payload: any) => {
  const result = await ServiceBanner.create(payload);
  return result;
};

// Get all service banners (Admin)
const getAllServiceBannersFromDB = async () => {
  const result = await ServiceBanner.find({}).sort({ createdAt: -1 });
  return result;
};

// Get only active service banners (Public)
const getActiveServiceBannersFromDB = async () => {
  const result = await ServiceBanner.find({ status: 'active' })
    .sort({ createdAt: -1 });
  return result;
};

// Get single banner by ID
const getServiceBannerByIdFromDB = async (id: string) => {
  const result = await ServiceBanner.findById(id);
  return result;
};

// Update full service banner
const updateServiceBannerInDB = async (id: string, payload: any) => {
  const result = await ServiceBanner.findByIdAndUpdate(
    id,
    payload,
    { new: true }
  );

  if (!result) {
    throw new Error('Service Banner not found to update.');
  }

  return result;
};

// Delete service banner
const deleteServiceBannerFromDB = async (id: string) => {
  const result = await ServiceBanner.findByIdAndDelete(id);

  if (!result) {
    throw new Error('Service Banner not found to delete.');
  }

  return null;
};

export const ServiceBannerServices = {
  createServiceBannerInDB,
  getAllServiceBannersFromDB,
  getActiveServiceBannersFromDB,
  getServiceBannerByIdFromDB,
  updateServiceBannerInDB,
  deleteServiceBannerFromDB,
};
