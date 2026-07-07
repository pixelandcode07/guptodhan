import { DonationCampaignModel } from "../donation/donation.model";
import { DonationClaimModel } from "../donation-claim/donation-claim.model";
import { Types } from "mongoose";

// ১. ইউজারের ড্যাশবোর্ড স্ট্যাটাস বের করা
const getUserStatsFromDB = async (userId: string, userEmail: string) => {
    // ইউজারের মোট ক্যাম্পেইন
    const totalCampaigns = await DonationCampaignModel.countDocuments({ user: new Types.ObjectId(userId) });

    // ইউজারের সফল (ডেলিভারড) ক্যাম্পেইন
    const completedCampaigns = await DonationCampaignModel.countDocuments({ 
        user: new Types.ObjectId(userId), 
        status: 'delivered' 
    });

    // ইউজারের মোট ক্লেইম (আবেদন) - ✅ FIX: user ID বা email যেকোনো একটা মিললেই হবে
    const totalClaims = await DonationClaimModel.countDocuments({
        $or: [
            { user: new Types.ObjectId(userId) },
            { email: userEmail }
        ]
    });

    // ইউজারের অ্যাপ্রুভ হওয়া ক্লেইম - ✅ FIX
    const approvedClaims = await DonationClaimModel.countDocuments({
        $or: [
            { user: new Types.ObjectId(userId) },
            { email: userEmail }
        ],
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
    const campaigns = await DonationCampaignModel.find({ user: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .populate('category', 'categoryName')
        .lean();
    return campaigns;
};

// ৩. ইউজারের আবেদন করা ক্লেইম বের করা
const getUserClaimsFromDB = async (userId: string, userEmail: string) => {
    // ✅ MAGIC FIX: এখন ডাটাবেসে user ID অথবা Email যেকোনো একটি দিয়ে খুঁজবে!
    // এর ফলে পুরোনো ডাটা (যাতে শুধু ইমেইল ছিল) এবং নতুন ডাটা (যাতে আইডি আছে) দুটোই শো করবে।
    const claims = await DonationClaimModel.find({
        $or: [
            { user: new Types.ObjectId(userId) },
            { email: userEmail }
        ]
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