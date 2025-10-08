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
  // First, find the existing document to get the old image URL
  const existingCta = await AboutCta.findById(id);
  if (!existingCta) {
    throw new Error('CTA not found to update.');
  }

  // ✅ FIX: If a new image URL is in the payload and an old image exists, delete the old one
  if (payload.ctaImage && existingCta.ctaImage) {
    await deleteFromCloudinary(existingCta.ctaImage);
  }
  
  // Now, update the document with the new data
  return await AboutCta.findByIdAndUpdate(id, payload, { new: true });
};

export const AboutCtaServices = {
  createCtaInDB,
  getPublicCtaFromDB,
  updateCtaInDB,
};