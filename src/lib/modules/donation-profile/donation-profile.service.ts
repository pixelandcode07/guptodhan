import { Types } from "mongoose";
import { DonationCampaign } from "../donation-campaign/donation-campaign.model";
import { DonationClaim } from "../donation-claim/donation-claim.model";

// ১. ইউজারের ড্যাশবোর্ড স্ট্যাটাস বের করা
const getUserStatsFromDB = async (userId: string, userEmail: string) => {
    // ইউজারের মোট ক্যাম্পেইন
    const totalCampaigns = await DonationCampaign.countDocuments({ 
        creator: new Types.ObjectId(userId) 
    });

    // ইউজারের সফল (completed) ক্যাম্পেইন
    const completedCampaigns = await DonationCampaign.countDocuments({ 
        creator: new Types.ObjectId(userId), 
        status: 'completed' 
    });

    // ✅ MAGIC FIX: User ID অথবা Email যেকোনো একটা মিললেই কাউন্ট করবে!
    const totalClaims = await DonationClaim.countDocuments({
        $or: [
            { user: new Types.ObjectId(userId) },
            { email: userEmail }
        ]
    });

    // ইউজারের অ্যাপ্রুভ হওয়া ক্লেইম
    const approvedClaims = await DonationClaim.countDocuments({
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
    const campaigns = await DonationCampaign.find({ creator: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .populate('category', 'categoryName')
        .lean();
    return campaigns;
};

// ৩. ইউজারের আবেদন করা ক্লেইম বের করা
const getUserClaimsFromDB = async (userId: string, userEmail: string) => {
    
    // ✅ MAGIC FIX: এখন ডাটাবেসে user ID অথবা Email যেকোনো একটি দিয়ে খুঁজবে!
    const claims = await DonationClaim.find({
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


const getReceivedClaimsFromDB = async (userId: string) => {
    // প্রথমে আপনার তৈরি করা সব ক্যাম্পেইনের আইডি বের করা
    const userCampaigns = await DonationCampaign.find({ creator: new Types.ObjectId(userId) }).select('_id');
    const campaignIds = userCampaigns.map(c => c._id);

    // এরপর ওই আইডিগুলোতে আসা সব ক্লেইম খুঁজে বের করা
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
    getReceivedClaimsFromDB,
};