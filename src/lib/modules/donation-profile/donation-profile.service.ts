import { Types } from "mongoose";
import { DonationCampaign } from "../donation-campaign/donation-campaign.model";
import { DonationClaim } from "../donation-claim/donation-claim.model";

// ১. ইউজারের ড্যাশবোর্ড স্ট্যাটাস বের করা
const getUserStatsFromDB = async (userId: string, userEmail: string) => {
    const totalCampaigns = await DonationCampaign.countDocuments({ 
        creator: new Types.ObjectId(userId) 
    });

    const completedCampaigns = await DonationCampaign.countDocuments({ 
        creator: new Types.ObjectId(userId), 
        status: 'completed' 
    });

    const totalClaims = await DonationClaim.countDocuments({
        email: userEmail
    });

    const approvedClaims = await DonationClaim.countDocuments({
        email: userEmail,
        status: 'approved'
    });

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
    const claims = await DonationClaim.find({
        email: userEmail
    })
    .sort({ createdAt: -1 })
    .populate({
        path: 'item',
        select: 'title images status category creator', // ✅ MAGIC FIX: creator যুক্ত করা হলো
        populate: {
            path: 'creator',
            select: 'name email phoneNumber' // ✅ MAGIC FIX: ডোনারের নাম, ইমেইল, ফোন নাম্বার বের করা হলো
        }
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