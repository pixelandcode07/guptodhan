import { IProductCountry } from './productCountry.interface';
import { ProductCountryModel } from './productCountry.model';
// ✅ আপনার কাস্টম ইউটিলিটি ফাইল ইম্পোর্ট করা হলো (VPS এ আপলোড/ডিলিট করার জন্য)
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/utils/cloudinary';

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
    // ✅ আপনার ইউটিলিটি ব্যবহার করে VPS-এ আপলোড
    const uploadResult = await uploadToCloudinary(flagFile.buffer, 'country-flags');
    payload.flag = uploadResult.secure_url;
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
    const existing = await ProductCountryModel.findById(id).lean<IProductCountry>();
    if (existing?.flag) {
      // ✅ আপনার ইউটিলিটি ব্যবহার করে পুরোনো ছবি ডিলিট
      await deleteFromCloudinary(existing.flag);
    }
    // ✅ নতুন ছবি আপলোড
    const uploadResult = await uploadToCloudinary(flagFile.buffer, 'country-flags');
    payload.flag = uploadResult.secure_url;
  }

  return await ProductCountryModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// ── DELETE ────────────────────────────────────────────────────────────────────
const deleteCountryFromDB = async (id: string) => {
  const country = await ProductCountryModel.findById(id).lean<IProductCountry>();
  
  if (country?.flag) {
    // ✅ ডিলিট করার সময় VPS থেকেও ছবি ডিলিট
    await deleteFromCloudinary(country.flag);
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