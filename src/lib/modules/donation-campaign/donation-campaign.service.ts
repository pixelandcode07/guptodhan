import mongoose from 'mongoose';
import { IDonationCampaign } from './donation-campaign.interface';
import { DonationCampaign } from './donation-campaign.model';
import dbConnect from '@/lib/db';
import '@/lib/modules/donation-category/donation-category.model';
import '@/lib/modules/user/user.model';
import { createAdminNotification } from '@/lib/utils/createAdminNotification';

const createCampaignInDB = async (payload: Partial<IDonationCampaign>) => {
  await dbConnect();

  if (payload.category) {
    const categoryExists = await mongoose.model('DonationCategory').findById(payload.category);
    if (!categoryExists) {
      throw new Error('Selected category does not exist');
    }
  }

  const result = await DonationCampaign.create({
    ...payload,
    moderationStatus: 'pending',
    status: 'inactive', 
  });

  await createAdminNotification(
    'donation',
    `New Donation Campaign pending approval: ${result.title}`,
    `/general/donation/donate-list`
  );

  return result;
};

const getPendingCampaignsFromDB = async () => {
  await dbConnect();
  return await DonationCampaign.find({ moderationStatus: 'pending' })
    .populate('creator', 'name email profilePicture')
    .populate('category', 'name')
    .sort({ createdAt: -1 });
};

const getApprovedCampaignsFromDB = async () => {
  await dbConnect();
  return await DonationCampaign.find({
    moderationStatus: 'approved',
    status: 'active', 
  })
    .populate('creator', 'name profilePicture')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();
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

const approveCampaignInDB = async (id: string, adminId: string) => {
  await dbConnect();

  const result = await DonationCampaign.findByIdAndUpdate(
    id,
    {
      moderationStatus: 'approved',
      approvedAt: new Date(),
      approvedBy: new mongoose.Types.ObjectId(adminId),
      status: 'active', 
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

const updateCampaignInDB = async (id: string, userId: string, payload: Partial<IDonationCampaign> & { newImages?: string[] }) => {
  await dbConnect();

  const campaign = await DonationCampaign.findById(id);
  
  if (!campaign) {
    throw new Error('Campaign not found');
  }

  const isOwner = campaign.creator.toString() === userId;
  if (!isOwner) {
    throw new Error('Forbidden: Only the creator can edit this campaign.');
  }

  const updateFields: any = {
    title: payload.title,
    category: payload.category,
    item: payload.item,
    description: payload.description,
    goalAmount: payload.goalAmount,
    images: payload.images, 
    moderationStatus: 'pending', 
    status: 'inactive',          
  };

  const result = await DonationCampaign.findByIdAndUpdate(id, updateFields, { new: true });
  return result;
};

const deleteCampaignFromDB = async (id: string, userId: string, userRole: string) => {
  await dbConnect();

  const campaign = await DonationCampaign.findById(id);

  if (!campaign) {
    throw new Error('Campaign not found to delete');
  }

  const isOwner = campaign.creator.toString() === userId;
  const isAdmin = userRole === 'admin';

  if (!isOwner && !isAdmin) {
    throw new Error('Forbidden: You are not allowed to delete this campaign.');
  }

  const result = await DonationCampaign.findByIdAndDelete(id);

  return result;
};

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

  if (result && result.goalAmount && result.raisedAmount >= result.goalAmount) {
    result.status = 'completed';
    result.completedAt = new Date();
    await result.save();
  }

  return result;
};

// ✅ MAGIC FIX: New function to handle ONLY status changes by admin
const updateCampaignStatusInDB = async (id: string, status: string) => {
  await dbConnect();
  
  const result = await DonationCampaign.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate('creator', 'name profilePicture').populate('category', 'name');

  if (!result) {
    throw new Error('Campaign not found to update status');
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
  updateCampaignStatusInDB, // ✅ Exported here
};