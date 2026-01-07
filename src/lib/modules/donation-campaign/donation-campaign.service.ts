import mongoose from 'mongoose';
import { IDonationCampaign } from './donation-campaign.interface';
import { DonationCampaign } from './donation-campaign.model';
import dbConnect from '@/lib/db';
import '@/lib/modules/donation-category/donation-category.model';
import '@/lib/modules/user/user.model';

/**
 * ✅ Create campaign with pending status and inactive
 */
const createCampaignInDB = async (payload: Partial<IDonationCampaign>) => {
  await dbConnect();

  if (payload.category) {
    const categoryExists = await mongoose.model('DonationCategory').findById(payload.category);
    if (!categoryExists) {
      throw new Error('Selected category does not exist');
    }
  }

  // ✅ Ensure campaign is created with proper initial state
  const result = await DonationCampaign.create({
    ...payload,
    moderationStatus: 'pending',
    status: 'inactive', // Explicitly set to inactive
  });

  return result;
};

/**
 * ✅ Get pending campaigns for admin review
 */
const getPendingCampaignsFromDB = async () => {
  await dbConnect();
  return await DonationCampaign.find({ moderationStatus: 'pending' })
    .populate('creator', 'name email profilePicture')
    .populate('category', 'name')
    .sort({ createdAt: -1 });
};

/**
 * ✅ Get only approved AND active campaigns (public view)
 */
const getApprovedCampaignsFromDB = async () => {
  await dbConnect();
  return await DonationCampaign.find({
    moderationStatus: 'approved',
    status: 'active', // ✅ Changed from $ne: 'archived' to explicit 'active'
  })
    .populate('creator', 'name profilePicture')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * ✅ Get all campaigns (admin panel)
 */
const getAllCampaignsFromDB = async () => {
  await dbConnect();
  return await DonationCampaign.find({})
    .populate('creator', 'name profilePicture')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * ✅ Get campaign by ID (with proper checks)
 */
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

/**
 * ✅ Approve campaign - sets moderationStatus to 'approved' AND status to 'active'
 */
const approveCampaignInDB = async (id: string, adminId: string) => {
  await dbConnect();

  const result = await DonationCampaign.findByIdAndUpdate(
    id,
    {
      moderationStatus: 'approved',
      approvedAt: new Date(),
      approvedBy: new mongoose.Types.ObjectId(adminId),
      status: 'active', // ✅ Only here it becomes active
    },
    { new: true }
  )
    .populate('creator', 'name profilePicture')
    .populate('category', 'name');

  if (!result) {
    throw new Error('Campaign not found to approve');
  }

  return result;
};

/**
 * ✅ Reject campaign - sets moderationStatus to 'rejected' AND status to 'inactive'
 */
const rejectCampaignInDB = async (id: string, reason: string) => {
  await dbConnect();

  const result = await DonationCampaign.findByIdAndUpdate(
    id,
    {
      moderationStatus: 'rejected',
      rejectionReason: reason,
      status: 'inactive',
    },
    { new: true }
  )
    .populate('creator', 'name profilePicture')
    .populate('category', 'name');

  if (!result) {
    throw new Error('Campaign not found to reject');
  }

  return result;
};

/**
 * ✅ Complete campaign (when goal reached)
 */
const completeCampaignInDB = async (id: string) => {
  await dbConnect();

  const result = await DonationCampaign.findByIdAndUpdate(
    id,
    {
      status: 'completed',
      completedAt: new Date(),
    },
    { new: true }
  );

  if (!result) {
    throw new Error('Campaign not found to complete');
  }

  return result;
};

/**
 * ✅ Archive campaign
 */
const archiveCampaignInDB = async (id: string) => {
  await dbConnect();

  const result = await DonationCampaign.findByIdAndUpdate(
    id,
    {
      status: 'archived',
    },
    { new: true }
  );

  if (!result) {
    throw new Error('Campaign not found to archive');
  }

  return result;
};

/**
 * ✅ Update campaign (only pending campaigns can be updated)
 */
const updateCampaignInDB = async (id: string, payload: Partial<IDonationCampaign>) => {
  await dbConnect();

  const campaign = await DonationCampaign.findById(id);
  
  if (!campaign) {
    throw new Error('Campaign not found');
  }

  if (campaign.moderationStatus !== 'pending') {
    throw new Error('Only pending campaigns can be updated');
  }

  const result = await DonationCampaign.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

/**
 * ✅ Delete campaign
 */
const deleteCampaignFromDB = async (id: string) => {
  await dbConnect();

  const result = await DonationCampaign.findByIdAndDelete(id);

  if (!result) {
    throw new Error('Campaign not found to delete');
  }

  return result;
};

/**
 * ✅ Increment donor count and check if goal reached
 */
const incrementDonorCount = async (campaignId: string, amount: number) => {
  await dbConnect();

  const result = await DonationCampaign.findByIdAndUpdate(
    campaignId,
    {
      $inc: {
        donorsCount: 1,
        raisedAmount: amount,
      },
    },
    { new: true }
  );

  // Auto-complete if goal reached
  if (result && result.goalAmount && result.raisedAmount >= result.goalAmount) {
    result.status = 'completed';
    result.completedAt = new Date();
    await result.save();
  }

  return result;
};

export const DonationCampaignServices = {
  createCampaignInDB,
  getPendingCampaignsFromDB,
  getApprovedCampaignsFromDB,
  getAllCampaignsFromDB,
  getCampaignByIdFromDB,
  approveCampaignInDB,
  rejectCampaignInDB,
  completeCampaignInDB,
  archiveCampaignInDB,
  updateCampaignInDB,
  deleteCampaignFromDB,
  incrementDonorCount,
};