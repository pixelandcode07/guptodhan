// src/lib/modules/donation-profile/donation-profile.service.ts

import mongoose from "mongoose";
import { DonationCampaign } from "../donation-campaign/donation-campaign.model";
import { DonationClaim } from "../donation-claim/donation-claim.model";

import "@/lib/modules/donation-category/donation-category.model"; 
import "@/lib/modules/user/user.model"; 

const getUserStatsFromDB = async (userId: string, userEmail: string) => {
  // স্ট্রিং আইডিকে অবজেক্ট আইডিতে রূপান্তর
  const creatorId = new mongoose.Types.ObjectId(userId);

  const totalCampaigns = await DonationCampaign.countDocuments({ creator: creatorId });
  const completedCampaigns = await DonationCampaign.countDocuments({ creator: creatorId, status: 'completed' });
  
  // ইমেইল কুয়েরি (নিশ্চিত করুন ডাটাবেসে ইমেইল হুবহু এক আছে)
  const totalClaims = await DonationClaim.countDocuments({ email: userEmail });
  const approvedClaims = await DonationClaim.countDocuments({ email: userEmail, status: 'approved' });

  return {
    totalCampaigns,
    completedCampaigns,
    totalClaims,
    approvedClaims
  };
};

const getUserCampaignsFromDB = async (userId: string) => {
  const campaigns = await DonationCampaign.find({ 
    creator: new mongoose.Types.ObjectId(userId) // আইডি অবজেক্টে রূপান্তর
  })
    .populate('category', 'name') 
    .sort({ createdAt: -1 });
    
  return campaigns;
};

const getUserClaimsFromDB = async (userEmail: string) => {
  if (!userEmail) return [];
  
  const claims = await DonationClaim.find({ email: userEmail })
    .populate({
      path: 'item',
      select: 'title item images status',
      model: 'DonationCampaign' 
    })
    .sort({ createdAt: -1 });

  return claims;
};

export const DonationProfileServices = {
  getUserStatsFromDB,
  getUserCampaignsFromDB,
  getUserClaimsFromDB,
};