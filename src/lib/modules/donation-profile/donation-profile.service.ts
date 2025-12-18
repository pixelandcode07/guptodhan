// src/lib/modules/donation-profile/donation-profile.service.ts

import { DonationCampaign } from "../donation-campaign/donation-campaign.model";
import { DonationClaim } from "../donation-claim/donation-claim.model";

// 🔥 FIX: এই লাইনগুলো অবশ্যই যোগ করতে হবে
// populate করার আগে মডেলগুলো লোড/রেজিস্টার করা জরুরি
import "@/lib/modules/donation-category/donation-category.model"; 
import "@/lib/modules/user/user.model"; 

const getUserStatsFromDB = async (userId: string, userEmail: string) => {
  const totalCampaigns = await DonationCampaign.countDocuments({ creator: userId });
  const completedCampaigns = await DonationCampaign.countDocuments({ creator: userId, status: 'completed' });
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
  // ক্যাটাগরি পপুলেট করার সময় মডেল লোড না থাকলে এরর দেয়
  const campaigns = await DonationCampaign.find({ creator: userId })
    .populate('category', 'name') 
    .sort({ createdAt: -1 })
    .lean();
    
  return campaigns;
};

const getUserClaimsFromDB = async (userEmail: string) => {
  const claims = await DonationClaim.find({ email: userEmail })
    .populate({
      path: 'item',
      select: 'title item images status',
      // নেস্টেড পপুলেট যদি লাগে, তবে এখানে মডেল বলে দেওয়া ভালো
      model: DonationCampaign 
    })
    .sort({ createdAt: -1 })
    .lean();

  return claims;
};

export const DonationProfileServices = {
  getUserStatsFromDB,
  getUserCampaignsFromDB,
  getUserClaimsFromDB,
};