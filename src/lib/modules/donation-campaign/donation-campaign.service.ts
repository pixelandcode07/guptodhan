// src/lib/modules/donation-campaign/donation-campaign.service.ts

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

const updateCampaignInDB = async (id: string, payload: Partial<IDonationCampaign>) => {
  await dbConnect();
  
  const result = await DonationCampaign.findByIdAndUpdate(id, payload, { new: true });
  
  if (!result) {
    throw new Error('Campaign not found to update');
  }
  return result;
};

const deleteCampaignFromDB = async (id: string) => {
  await dbConnect();
  
  const result = await DonationCampaign.findByIdAndDelete(id);
  
  if (!result) {
    throw new Error('Campaign not found to delete');
  }
  return result;
};

// ✅ NEW: Increment donors when donation made
const incrementDonorCount = async (campaignId: string, amount: number) => {
  await dbConnect();
  
  const result = await DonationCampaign.findByIdAndUpdate(
    campaignId,
    {
      $inc: { 
        donorsCount: 1,      // Increment donors
        raisedAmount: amount // Add amount
      }
    },
    { new: true }
  );

  // Check if goal reached
  if (result && result.goalAmount && result.raisedAmount >= result.goalAmount) {
    result.status = 'completed';
    await result.save();
  }

  return result;
};

export const DonationCampaignServices = {
  createCampaignInDB,
  getAllCampaignsFromDB,
  getCampaignByIdFromDB,
  updateCampaignInDB,
  deleteCampaignFromDB,
  incrementDonorCount // ← Export this
};