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

// ✅ NEW: Update Status Logic
const updateClaimStatusInDB = async (id: string, status: string) => {
  const result = await DonationClaim.findByIdAndUpdate(
    id, 
    { status: status }, 
    { new: true } // রিটার্ন করার সময় আপডেটেড ডাটা দিবে
  );
  return result;
};

export const DonationClaimServices = {
  createClaimInDB,
  getAllClaimsFromDB,
  deleteClaimFromDB,
  updateClaimStatusInDB // Exported
};