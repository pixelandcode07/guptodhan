import { ISettings } from './settings.interface';
import { Settings } from './settings.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

// This is your existing create/update (upsert) function
const createOrUpdateSettingsInDB = async (payload: Partial<ISettings>) => {
  const existingSettings = await Settings.findOne();

  // If new images are uploaded, delete the old ones
  if (existingSettings) {
    const fieldsToDelete: (keyof ISettings)[] = ['primaryLogoLight', 'secondaryLogoDark', 'favicon', 'paymentBanner', 'userBanner'];
    for (const field of fieldsToDelete) {
      if (payload[field] && existingSettings[field]) {
        await deleteFromCloudinary(existingSettings[field] as string);
      }
    }
  }

  return await Settings.findOneAndUpdate({}, payload, { new: true, upsert: true });
};

// This is your existing get function
const getPublicSettingsFromDB = async () => {
  return await Settings.findOne({ isActive: true });
};

// ✅ NEW: Function to update settings by ID
const updateSettingsInDB = async (id: string, payload: Partial<ISettings>) => {
    // This function can be used for partial updates
    return await Settings.findByIdAndUpdate(id, payload, { new: true });
};

// ✅ NEW: Function to delete settings
const deleteSettingsFromDB = async (id: string) => {
    const settings = await Settings.findById(id);
    if (!settings) {
        throw new Error("Settings not found to delete.");
    }
    
    // Delete all associated images from Cloudinary before deleting the document
    const imagesToDelete = [
        settings.primaryLogoLight,
        settings.secondaryLogoDark,
        settings.favicon,
        settings.paymentBanner,
        settings.userBanner
    ];

    for (const imageUrl of imagesToDelete) {
        if (imageUrl) {
            await deleteFromCloudinary(imageUrl);
        }
    }
    
    await Settings.findByIdAndDelete(id);
    return null;
};

export const SettingsServices = {
  createOrUpdateSettingsInDB,
  getPublicSettingsFromDB,
  updateSettingsInDB, // ✅ Add this
  deleteSettingsFromDB, // ✅ Add this
};