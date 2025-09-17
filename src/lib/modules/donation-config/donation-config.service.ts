import { IDonationConfig } from './donation-config.interface';
import { DonationConfig } from './donation-config.model';

// যেহেতু সাধারণত একটি মাত্র কনফিগারেশন থাকে, তাই আগের সব কনফিগারেশন মুছে নতুনটি তৈরি করা হচ্ছে
const setDonationConfigInDB = async (payload: Partial<IDonationConfig>) => {
  // Delete all previous configurations to ensure only one exists
  await DonationConfig.deleteMany({});
  const result = await DonationConfig.create(payload);
  return result;
};

// ওয়েবসাইটের public অংশে দেখানোর জন্য সর্বশেষ কনফিগারেশনটি নেওয়া হচ্ছে
const getDonationConfigFromDB = async () => {
  const result = await DonationConfig.findOne().sort({ createdAt: -1 });
  return result;
};

const deleteDonationConfigFromDB = async () => {
  // সব কনফিগারেশন মুছে ফেলা হচ্ছে
  await DonationConfig.deleteMany({});
  return null;
};

export const DonationConfigServices = {
  setDonationConfigInDB,
  getDonationConfigFromDB,
  deleteDonationConfigFromDB,
};