// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-cta\cta.service.ts

import { IAboutCta } from './cta.interface';
import { AboutCta } from './cta.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createCtaInDB = async (payload: Partial<IAboutCta>) => {
  // Shudhu ekta CTA thakbe, tai ager sob delete kore dewa hocche
  const existingCta = await AboutCta.find();
  if (existingCta.length > 0) {
    await Promise.all(existingCta.map(cta => deleteFromCloudinary(cta.ctaImage)));
    await AboutCta.deleteMany({});
  }
  return await AboutCta.create(payload);
};

const getPublicCtaFromDB = async () => {
  return await AboutCta.findOne({ isActive: true });
};

const updateCtaInDB = async (id: string, payload: Partial<IAboutCta>) => {
  return await AboutCta.findByIdAndUpdate(id, payload, { new: true });
};

export const AboutCtaServices = {
  createCtaInDB,
  getPublicCtaFromDB,
  updateCtaInDB,
};