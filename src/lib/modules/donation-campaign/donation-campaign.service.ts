import { IDonationCampaign } from './donation-campaign.interface.ts';
import { DonationCampaign } from './donation-campaign.model.ts';

const createCampaignInDB = async (payload: Partial<IDonationCampaign>) => {
  return await DonationCampaign.create(payload);
};

const getAllCampaignsFromDB = async () => {
  return await DonationCampaign.find({ status: 'active' })
    .populate('creator', 'name profilePicture')
    .populate('category', 'name')
    .sort({ createdAt: -1 });
};

const getCampaignByIdFromDB = async (id: string) => {
    return await DonationCampaign.findById(id)
      .populate('creator', 'name profilePicture')
      .populate('category', 'name');
};

export const DonationCampaignServices = {
  createCampaignInDB,
  getAllCampaignsFromDB,
  getCampaignByIdFromDB,
};