import { DonationClaim } from './donation-claim.model';
import { IDonationClaim } from './donation-claim.interface';
import { DonationCampaignServices } from '../donation-campaign/donation-campaign.service';
import dbConnect from '@/lib/db';

// Models imports
import '../donation-campaign/donation-campaign.model';
import '../user/user.model';
import { DonationCampaign } from '../donation-campaign/donation-campaign.model'; // ✅ MAGIC FIX: Quantity আপডেট করার জন্য মডেল ইমপোর্ট করা হলো

const createClaimInDB = async (payload: Partial<IDonationClaim>) => {
  await dbConnect();
  
  const result = await DonationClaim.create(payload);
  
  if (payload.item) {
    // Increment donor/request count
    await DonationCampaignServices.incrementDonorCount(payload.item as any, 0);

    // ✅ MAGIC FIX: যদি এটা Money না হয়, তাহলে Quantity ১ পিস মাইনাস করো
    const campaign = await DonationCampaign.findById(payload.item);
    if (campaign && campaign.item !== 'money' && campaign.quantity && campaign.quantity > 0) {
      campaign.quantity -= 1;
      
      // যদি কোয়ান্টিটি 0 হয়ে যায়, তবে স্ট্যাটাস completed করে দাও
      if (campaign.quantity === 0) {
        campaign.status = 'completed';
        campaign.completedAt = new Date();
      }
      
      await campaign.save();
    }
  }
  
  return result;
};

const getAllClaimsFromDB = async () => {
  await dbConnect();
  
  const result = await DonationClaim.find()
    .populate('item')
    .sort({ createdAt: -1 });
    
  return result;
};

const deleteClaimFromDB = async (id: string) => {
  await dbConnect();
  const result = await DonationClaim.findByIdAndDelete(id);
  return result;
};

const updateClaimStatusInDB = async (id: string, status: string) => {
  await dbConnect();
  
  const result = await DonationClaim.findByIdAndUpdate(
    id, 
    { status }, 
    { new: true }
  );
  
  return result;
};

export const DonationClaimServices = {
  createClaimInDB,
  getAllClaimsFromDB,
  deleteClaimFromDB,
  updateClaimStatusInDB
};