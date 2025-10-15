import { IShippingPolicy } from './shipping-policy.interface';
import { ShippingPolicy } from './shipping-policy.model';

// Upsert logic: Create or update the single document
const createOrUpdatePolicyInDB = async (payload: Partial<IShippingPolicy>) => {
  return await ShippingPolicy.findOneAndUpdate({}, payload, { new: true, upsert: true });
};

// Get the public-facing policy
const getPublicPolicyFromDB = async () => {
  return await ShippingPolicy.findOne({ status: 'active' });
};

export const ShippingPolicyServices = {
  createOrUpdatePolicyInDB,
  getPublicPolicyFromDB,
};