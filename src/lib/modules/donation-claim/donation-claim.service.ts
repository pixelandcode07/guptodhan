import { DonationClaim } from './donation-claim.model';
import { IDonationClaim } from './donation-claim.interface';
import { DonationCampaignServices } from '../donation-campaign/donation-campaign.service';
import dbConnect from '@/lib/db';

// Models imports
import '../donation-campaign/donation-campaign.model';
import '../user/user.model';
import { DonationCampaign } from '../donation-campaign/donation-campaign.model'; 

const createClaimInDB = async (payload: Partial<IDonationClaim>) => {
  await dbConnect();
  
  const result = await DonationClaim.create(payload);
  
  if (payload.item) {
    // 1. Increment donor/request count (এই ফাংশনটি শুধু কাউন্ট ১ বাড়াবে)
    await DonationCampaignServices.incrementDonorCount(payload.item as any, 0);

    // 2. ✅ MAGIC FIX: Quantity আপডেট করার জন্য .save() বাদ দিয়ে updateOne() ব্যবহার করা হলো 
    // যাতে race condition তৈরি না হয় এবং কাউন্ট কোনোভাবেই ২ বার না বাড়ে।
    const campaign = await DonationCampaign.findById(payload.item);
    if (campaign && campaign.item !== 'money' && campaign.quantity && campaign.quantity > 0) {
      
      const newQuantity = campaign.quantity - 1;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updates: any = { quantity: newQuantity };
      
      // যদি কোয়ান্টিটি 0 হয়ে যায়, তবে স্ট্যাটাস completed করে দাও
      if (newQuantity === 0) {
        updates.status = 'completed';
        updates.completedAt = new Date();
      }
      
      // শুধুমাত্র Quantity এবং Status আপডেট হবে, Request count-এ হাত দেওয়া হবে না
      await DonationCampaign.updateOne({ _id: payload.item }, { $set: updates });
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