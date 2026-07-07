import { Types } from "mongoose";
import { DonationCampaign } from "../donation-campaign/donation-campaign.model";
import { DonationClaim } from "../donation-claim/donation-claim.model";

// ১. ইউজারের ড্যাশবোর্ড স্ট্যাটাস বের করা
const getUserStatsFromDB = async (userId: string) => {
    // ইউজারের মোট ক্যাম্পেইন
    const totalCampaigns = await DonationCampaign.countDocuments({ 
        creator: new Types.ObjectId(userId) 
    });

    // ইউজারের সফল (completed) ক্যাম্পেইন
    const completedCampaigns = await DonationCampaign.countDocuments({ 
        creator: new Types.ObjectId(userId), 
        status: 'completed' 
    });

    // ✅ MAGIC FIX: শুধুমাত্র userId দিয়ে ক্লেইম কাউন্ট করা হচ্ছে
    const totalClaims = await DonationClaim.countDocuments({
        user: new Types.ObjectId(userId)
    });

    // ✅ MAGIC FIX: শুধুমাত্র userId দিয়ে অ্যাপ্রুভ হওয়া ক্লেইম কাউন্ট করা হচ্ছে
    const approvedClaims = await DonationClaim.countDocuments({
        user: new Types.ObjectId(userId),
        status: 'approved'
    });

    return {
        totalCampaigns,
        completedCampaigns,
        totalClaims,
        approvedClaims
    };
};

// ২. ইউজারের তৈরি করা ক্যাম্পেইন বের করা
const getUserCampaignsFromDB = async (userId: string) => {
    const campaigns = await DonationCampaign.find({ creator: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .populate('category', 'categoryName')
        .lean();
    return campaigns;
};

// ৩. ইউজারের আবেদন করা ক্লেইম বের করা
const getUserClaimsFromDB = async (userId: string) => {
    
    // ✅ MAGIC FIX: শুধুমাত্র userId দিয়ে ক্লেইমগুলো ডাটাবেস থেকে খুঁজে বের করা হচ্ছে
    const claims = await DonationClaim.find({
        user: new Types.ObjectId(userId)
    })
    .sort({ createdAt: -1 })
    .populate({
        path: 'item',
        select: 'title images status category'
    })
    .lean();

    return claims;
};

export const DonationProfileServices = {
    getUserStatsFromDB,
    getUserCampaignsFromDB,
    getUserClaimsFromDB
};