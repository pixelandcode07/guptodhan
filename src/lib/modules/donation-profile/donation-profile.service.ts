import { Types } from "mongoose";
import { DonationCampaign } from "../donation-campaign/donation-campaign.model";
import { DonationClaim } from "../donation-claim/donation-claim.model";

// ১. ইউজারের ড্যাশবোর্ড স্ট্যাটাস বের করা
const getUserStatsFromDB = async (userId: string, userEmail: string) => {
    // ইউজারের মোট ক্যাম্পেইন (এটা userId দিয়েই খুঁজতে হবে কারণ মডেলে creator হলো ObjectId)
    const totalCampaigns = await DonationCampaign.countDocuments({ 
        creator: new Types.ObjectId(userId) 
    });

    // ইউজারের সফল (completed) ক্যাম্পেইন
    const completedCampaigns = await DonationCampaign.countDocuments({ 
        creator: new Types.ObjectId(userId), 
        status: 'completed' 
    });

    // ✅ MAGIC FIX: শুধুমাত্র Email দিয়ে ক্লেইম কাউন্ট করা হচ্ছে (ObjectId বাদ)
    const totalClaims = await DonationClaim.countDocuments({
        email: userEmail
    });

    // ✅ MAGIC FIX: শুধুমাত্র Email দিয়ে অ্যাপ্রুভ হওয়া ক্লেইম কাউন্ট করা হচ্ছে (ObjectId বাদ)
    const approvedClaims = await DonationClaim.countDocuments({
        email: userEmail,
        status: 'approved'
    });

    // Received Requests কাউন্ট
    const userCampaigns = await DonationCampaign.find({ creator: new Types.ObjectId(userId) }).select('_id');
    const campaignIds = userCampaigns.map(c => c._id);
    const receivedRequests = await DonationClaim.countDocuments({ item: { $in: campaignIds } });

    return {
        totalCampaigns,
        completedCampaigns,
        totalClaims,
        approvedClaims,
        receivedRequests 
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
const getUserClaimsFromDB = async (userEmail: string) => {
    
    // ✅ MAGIC FIX: শুধুমাত্র Email দিয়ে ক্লেইমগুলো ডাটাবেস থেকে খুঁজে বের করা হচ্ছে (ObjectId বাদ)
    const claims = await DonationClaim.find({
        email: userEmail
    })
    .sort({ createdAt: -1 })
    .populate({
        path: 'item',
        select: 'title images status category'
    })
    .lean();

    return claims;
};

// ৪. ইউজারের ক্যাম্পেইনে আসা অন্যদের রিকোয়েস্ট বের করা
const getReceivedClaimsFromDB = async (userId: string) => {
    const userCampaigns = await DonationCampaign.find({ creator: new Types.ObjectId(userId) }).select('_id');
    const campaignIds = userCampaigns.map(c => c._id);

    const claims = await DonationClaim.find({ item: { $in: campaignIds } })
        .sort({ createdAt: -1 })
        .populate({ path: 'item', select: 'title images status' })
        .lean();

    return claims;
};

export const DonationProfileServices = {
    getUserStatsFromDB,
    getUserCampaignsFromDB,
    getUserClaimsFromDB,
    getReceivedClaimsFromDB
};