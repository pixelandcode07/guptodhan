import { Types } from "mongoose";
import { DonationCampaign } from "../donation-campaign/donation-campaign.model";
import { DonationClaim } from "../donation-claim/donation-claim.model";

// ১. ইউজারের ড্যাশবোর্ড স্ট্যাটাস বের করা
const getUserStatsFromDB = async (userId: string, userEmail: string) => {
    // ইউজারের মোট ক্যাম্পেইন (✅ FIX: 'user' এর বদলে 'creator' হবে মডেল অনুযায়ী)
    const totalCampaigns = await DonationCampaign.countDocuments({ 
        creator: new Types.ObjectId(userId) 
    });

    // ইউজারের সফল ক্যাম্পেইন (✅ FIX: 'delivered' নয়, মডেলে 'completed' দেওয়া আছে)
    const completedCampaigns = await DonationCampaign.countDocuments({ 
        creator: new Types.ObjectId(userId), 
        status: 'completed' 
    });

    // ইউজারের মোট ক্লেইম/আবেদন (✅ FIX: DonationClaim মডেলে শুধু email আছে, user id নেই)
    const totalClaims = await DonationClaim.countDocuments({
        email: userEmail
    });

    // ইউজারের অ্যাপ্রুভ হওয়া ক্লেইম (✅ FIX)
    const approvedClaims = await DonationClaim.countDocuments({
        email: userEmail,
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
    // ✅ FIX: 'user' এর বদলে 'creator'
    const campaigns = await DonationCampaign.find({ creator: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .populate('category', 'categoryName')
        .lean();
    return campaigns;
};

// ৩. ইউজারের আবেদন করা ক্লেইম বের করা
const getUserClaimsFromDB = async (userId: string, userEmail: string) => {
    // ✅ MAGIC FIX: DonationClaim মডেলে যেহেতু শুধু email সেভ হয়, তাই email দিয়েই খুঁজতে হবে!
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

export const DonationProfileServices = {
    getUserStatsFromDB,
    getUserCampaignsFromDB,
    getUserClaimsFromDB
};