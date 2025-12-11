import { DonationClaim } from './donation-claim.model';
import { IDonationClaim } from './donation-claim.interface';

const createClaimInDB = async (payload: Partial<IDonationClaim>) => {
  const result = await DonationClaim.create(payload);
  return result;
};

const getAllClaimsFromDB = async () => {
  const result = await DonationClaim.find().populate('item').sort({ createdAt: -1 });
  return result;
};

const deleteClaimFromDB = async (id: string) => {
  const result = await DonationClaim.findByIdAndDelete(id);
  return result;
};

export const DonationClaimServices = {
  createClaimInDB,
  getAllClaimsFromDB,
  deleteClaimFromDB
};