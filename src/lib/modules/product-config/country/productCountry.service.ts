// src/lib/modules/product-config/services/productCountry.service.ts

import { v2 as cloudinary } from 'cloudinary';
import { IProductCountry } from './productCountry.interface';
import { ProductCountryModel } from './productCountry.model';

// ─── Cloudinary config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ─── Helper: extract public_id from Cloudinary URL ───────────────────────────
const extractPublicId = (url: string): string | null => {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

// ─── Helper: upload buffer to Cloudinary ─────────────────────────────────────
const uploadFlagToCloudinary = (
  buffer: Buffer,
  mimeType: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'guptodhan/country-flags',
        resource_type: 'image',
        format: 'webp',
        transformation: [
          { width: 120, height: 80, crop: 'fill' },
          { quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// ─── Helper: delete old flag from Cloudinary ─────────────────────────────────
const deleteFlagFromCloudinary = async (url: string): Promise<void> => {
  const publicId = extractPublicId(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    console.warn('Could not delete old flag from Cloudinary:', publicId);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ── CREATE ────────────────────────────────────────────────────────────────────
const createCountryInDB = async (
  payload: Partial<IProductCountry>,
  flagFile?: { buffer: Buffer; mimeType: string }
) => {
  const existing = await ProductCountryModel.findOne({ name: payload.name });
  if (existing) throw new Error(`Country "${payload.name}" already exists.`);

  if (flagFile) {
    payload.flag = await uploadFlagToCloudinary(flagFile.buffer, flagFile.mimeType);
  }

  return await ProductCountryModel.create(payload);
};

// ── GET ALL ───────────────────────────────────────────────────────────────────
const getAllCountriesFromDB = async (onlyActive = false) => {
  const filter = onlyActive ? { status: 'active' } : {};
  return await ProductCountryModel.find(filter).sort({ name: 1 }).lean();
};

// ── GET ONE ───────────────────────────────────────────────────────────────────
const getCountryByIdFromDB = async (id: string) => {
  return await ProductCountryModel.findById(id).lean();
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
const updateCountryInDB = async (
  id: string,
  payload: Partial<IProductCountry>,
  flagFile?: { buffer: Buffer; mimeType: string }
) => {
  if (flagFile) {
    // ✅ FIX: .lean<IProductCountry>() — TypeScript এখন flag field চিনবে
    const existing = await ProductCountryModel.findById(id).lean<IProductCountry>();
    if (existing?.flag) {
      await deleteFlagFromCloudinary(existing.flag);
    }
    payload.flag = await uploadFlagToCloudinary(flagFile.buffer, flagFile.mimeType);
  }

  return await ProductCountryModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// ── DELETE ────────────────────────────────────────────────────────────────────
const deleteCountryFromDB = async (id: string) => {
  // ✅ FIX: .lean<IProductCountry>() — TypeScript এখন flag field চিনবে
  const country = await ProductCountryModel.findById(id).lean<IProductCountry>();
  if (country?.flag) {
    await deleteFlagFromCloudinary(country.flag);
  }

  return await ProductCountryModel.findByIdAndDelete(id);
};

// ═══════════════════════════════════════════════════════════════════════════════
export const ProductCountryService = {
  createCountryInDB,
  getAllCountriesFromDB,
  getCountryByIdFromDB,
  updateCountryInDB,
  deleteCountryFromDB,
};