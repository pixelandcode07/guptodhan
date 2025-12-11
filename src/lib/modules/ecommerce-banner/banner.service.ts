import { IEcommerceBanner } from './banner.interface';
import { EcommerceBanner } from './banner.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createBannerInDB = async (payload: Partial<IEcommerceBanner>) => EcommerceBanner.create(payload);

const getAllBannersFromDB = async () => EcommerceBanner.find({}).sort({ orderCount: 1 });

const getPublicBannersByPositionFromDB = async (position: string) => EcommerceBanner.find({ bannerPosition: position, status: 'active' });

const updateBannerInDB = async (id: string, payload: Partial<IEcommerceBanner>) => {
  if (payload.bannerImage) {
    const existingBanner = await EcommerceBanner.findById(id);
    if (existingBanner?.bannerImage) {
      await deleteFromCloudinary(existingBanner.bannerImage);
    }
  }
  return await EcommerceBanner.findByIdAndUpdate(id, payload, { new: true });
};

const deleteBannerInDB = async (id: string) => {
  const banner = await EcommerceBanner.findById(id);
  if (!banner) throw new Error("Banner not found.");
  if (banner.bannerImage) await deleteFromCloudinary(banner.bannerImage);
  return await EcommerceBanner.findByIdAndDelete(id);
};


// rearrange banner  
export const reorderBannerService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error('banner array is empty');
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    EcommerceBanner.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  return { message: 'banner reordered successfully!' };
};

export const EcommerceBannerServices = {
  createBannerInDB,
  getAllBannersFromDB,
  getPublicBannersByPositionFromDB,
  updateBannerInDB,
  deleteBannerInDB,

  reorderBannerService
}; 