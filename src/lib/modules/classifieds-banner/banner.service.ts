
import { IClassifiedBanner } from './banner.interface';
import { ClassifiedBanner } from './banner.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createBannerInDB = async (payload: Partial<IClassifiedBanner>) => {
  const result = await ClassifiedBanner.create(payload);
  return result;
};

const getAllPublicBannersFromDB = async () => {
  const result = await ClassifiedBanner.find({ status: 'active' }).sort({ createdAt: -1 });
  return result;
};

const deleteBannerFromDB = async (id: string) => {
  const banner = await ClassifiedBanner.findById(id);
  if (!banner) { throw new Error("Banner not found"); }

  await deleteFromCloudinary(banner.bannerImage);

  await ClassifiedBanner.findByIdAndDelete(id);
  return null;
};

const updateBannerInDB = async (id: string, updateData: Partial<IClassifiedBanner>) => {
  if (updateData.bannerImage) {
    const banner = await ClassifiedBanner.findById(id);
    if (banner?.bannerImage) {
      await deleteFromCloudinary(banner.bannerImage);
    }
  }

  const updatedBanner = await ClassifiedBanner.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedBanner) throw new Error('Banner not found');
  return updatedBanner;
};

export const ClassifiedBannerServices = {
  createBannerInDB,
  getAllPublicBannersFromDB,
  deleteBannerFromDB,
  updateBannerInDB,
};