// ============================================
// 🔥 DONATION CAMPAIGN SERVICE - FIXED
// ============================================

import mongoose from "mongoose";
import { IDonationCampaign } from "./donation-campaign.interface";
import { DonationCampaign } from "./donation-campaign.model";
import dbConnect from "@/lib/db";
import "@/lib/modules/donation-category/donation-category.model"; 
import "@/lib/modules/user/user.model"; 

const createCampaignInDB = async (payload: Partial<IDonationCampaign>) => {
  await dbConnect();
  
  // ✅ FIX: Validate category exists before creating
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
  return await DonationCampaign.find({ status: 'active' })
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
      .populate('category', 'name')  // ✅ Make sure populate is correct
      .lean();

    if (!campaign) {
        throw new Error('Campaign not found');
    }

    return campaign;
};

export const DonationCampaignServices = {
  createCampaignInDB,
  getAllCampaignsFromDB,
  getCampaignByIdFromDB,
};