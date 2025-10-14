// src/lib/modules/about-cta/cta.service.ts
import { IAboutCta } from './cta.interface';
import { AboutCta } from './cta.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createCtaInDB = async (payload: Partial<IAboutCta>) => {
  // Keep only one CTA: delete old ones and their images
  const existingCta = await AboutCta.find();
  if (existingCta.length > 0) {
    // delete images first (best-effort) then delete docs
    await Promise.all(
      existingCta.map(async cta => {
        try {
          if (cta.ctaImage) await deleteFromCloudinary(cta.ctaImage);
        } catch (err) {
          console.warn('Failed to delete old CTA image:', err);
        }
      })
    );
    await AboutCta.deleteMany({});
  }
  return await AboutCta.create(payload);
};

const getPublicCtaFromDB = async () => {
  return await AboutCta.findOne({ isActive: true });
};

const updateCtaInDB = async (id: string, payload: Partial<IAboutCta>) => {
  const existingCta = await AboutCta.findById(id);
  if (!existingCta) {
    throw new Error('CTA not found to update.');
  }

  // If we are replacing the image, delete the old one AFTER successful upload.
  // We assume controller uploads new image first and includes new URL in payload.ctaImage.
  if (payload.ctaImage && existingCta.ctaImage) {
    try {
      // delete old image from cloudinary
      await deleteFromCloudinary(existingCta.ctaImage);
    } catch (err) {
      console.warn('Failed to delete old image from Cloudinary:', err);
      // continue — we don't want to block update if deletion fails
    }
  }

  // Update and return the new document (validate with mongoose)
  const updated = await AboutCta.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new Error('Failed to update CTA.');

  return updated;
};

export const AboutCtaServices = {
  createCtaInDB,
  getPublicCtaFromDB,
  updateCtaInDB,
};
