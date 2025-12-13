import { IDonationConfig } from './donation-config.interface';
import { DonationConfig } from './donation-config.model';

// Create or Replace (Old logic)
const setDonationConfigInDB = async (payload: Partial<IDonationConfig>) => {
  await DonationConfig.deleteMany({});
  const result = await DonationConfig.create(payload);
  return result;
};

// 🔥 Update Existing Logic (New)
const updateDonationConfigInDB = async (payload: Partial<IDonationConfig>) => {
  // findOneAndUpdate ব্যবহার করছি, upsert: true মানে ডাটা না থাকলে বানিয়ে নিবে
  const result = await DonationConfig.findOneAndUpdate({}, payload, { 
    new: true, 
    upsert: true,
    sort: { createdAt: -1 } 
  });
  return result;
};

const getDonationConfigFromDB = async () => {
  const result = await DonationConfig.findOne().sort({ createdAt: -1 });
  return result;
};

const deleteDonationConfigFromDB = async () => {
  await DonationConfig.deleteMany({});
  return null;
};

export const DonationConfigServices = {
  setDonationConfigInDB,
  updateDonationConfigInDB, // Export new function
  getDonationConfigFromDB,
  deleteDonationConfigFromDB,
}