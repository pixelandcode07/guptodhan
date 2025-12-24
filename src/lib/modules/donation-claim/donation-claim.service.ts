// src/lib/modules/donation-claim/donation-claim.service.ts

import { DonationClaim } from './donation-claim.model';
import { IDonationClaim } from './donation-claim.interface';
import { DonationCampaignServices } from '../donation-campaign/donation-campaign.service';
import dbConnect from '@/lib/db';

const createClaimInDB = async (payload: Partial<IDonationClaim>) => {
  await dbConnect();
  
  const result = await DonationClaim.create(payload);
  
  // ✅ Increment donor count when claim created
  if (payload.item) {
    await DonationCampaignServices.incrementDonorCount(payload.item as any, 0);
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