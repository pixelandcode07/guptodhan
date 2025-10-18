import { IPrivacyPolicy } from './privacy-policy.interface';
import { PrivacyPolicy } from './privacy-policy.model';

// Upsert logic: Create or update the single document
const createOrUpdatePolicyInDB = async (payload: Partial<IPrivacyPolicy>) => {
  return await PrivacyPolicy.findOneAndUpdate({}, payload, { new: true, upsert: true });
};

// Get the public-facing policy
const getPublicPolicyFromDB = async () => {
  return await PrivacyPolicy.findOne({ status: 'active' });
};

export const PrivacyPolicyServices = {
  createOrUpdatePolicyInDB,
  getPublicPolicyFromDB,
};