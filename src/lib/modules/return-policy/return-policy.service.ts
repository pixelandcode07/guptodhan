import { IReturnPolicy } from './return-policy.interface';
import { ReturnPolicy } from './return-policy.model';

// Upsert logic: Create or update the single document
const createOrUpdatePolicyInDB = async (payload: Partial<IReturnPolicy>) => {
  return await ReturnPolicy.findOneAndUpdate({}, payload, { new: true, upsert: true });
};

// Get the public-facing policy
const getPublicPolicyFromDB = async () => {
  return await ReturnPolicy.findOne({ status: 'active' });
};

export const ReturnPolicyServices = {
  createOrUpdatePolicyInDB,
  getPublicPolicyFromDB,
};