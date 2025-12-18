// ============================================
// 🔥 DONATION CAMPAIGN SERVICE - UPDATED
// ============================================

import mongoose from "mongoose";
import { IDonationCampaign } from "./donation-campaign.interface";
import { DonationCampaign } from "./donation-campaign.model";
import dbConnect from "@/lib/db";
import "@/lib/modules/donation-category/donation-category.model"; 
import "@/lib/modules/user/user.model"; 

const createCampaignInDB = async (payload: Partial<IDonationCampaign>) => {
  await dbConnect();
  
  if (payload.category) {
    const categoryExists = await mongoose.model('DonationCategory').findById(payload.category);
    if (!categoryExists) {
      throw new Error('Selected category does not exist');
    }
  }

  const result = await DonationCampaign.create(payload);
  return result;
};

const getAllCampaignsFromDB = async () => {
  await dbConnect();
  // অ্যাডমিনের জন্য সব স্ট্যাটাসই রিটার্ন করা উচিত, তাই ফিল্টার সরালাম
  // আপনি চাইলে পাবলিক API এর জন্য আলাদা ফাংশন রাখতে পারেন
  return await DonationCampaign.find({}) 
    .populate('creator', 'name profilePicture')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();
};

const getCampaignByIdFromDB = async (id: string) => {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid Campaign ID format');
    }

    const campaign = await DonationCampaign.findById(id)
      .populate('creator', 'name profilePicture')
      .populate('category', 'name')
      .lean();

    if (!campaign) {
        throw new Error('Campaign not found');
    }

    return campaign;
};

// ✅ NEW: Update Campaign Service
const updateCampaignInDB = async (id: string, payload: Partial<IDonationCampaign>) => {
    await dbConnect();
    
    const result = await DonationCampaign.findByIdAndUpdate(id, payload, { new: true });
    
    if (!result) {
        throw new Error('Campaign not found to update');
    }
    return result;
};

// ✅ NEW: Delete Campaign Service
const deleteCampaignFromDB = async (id: string) => {
    await dbConnect();
    
    const result = await DonationCampaign.findByIdAndDelete(id);
    
    if (!result) {
        throw new Error('Campaign not found to delete');
    }
    return result;
};

export const DonationCampaignServices = {
  createCampaignInDB,
  getAllCampaignsFromDB,
  getCampaignByIdFromDB,
  updateCampaignInDB, // Exported
  deleteCampaignFromDB, // Exported
};