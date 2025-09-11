// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\integrations\integrations.service.ts

import { IIntegrations } from './integrations.interface';
import { Integrations } from './integrations.model';

// Upsert logic: যদি কোনো ইন্টিগ্রেশন ডকুমেন্ট না থাকে, তবে নতুন তৈরি করবে,
// আর থাকলে, পুরনোটিকে আপডেট করবে
const createOrUpdateIntegrationsInDB = async (payload: Partial<IIntegrations>) => {
  return await Integrations.findOneAndUpdate({}, payload, { new: true, upsert: true });
};

const getPublicIntegrationsFromDB = async () => {
  return await Integrations.findOne();
};

export const IntegrationsServices = {
  createOrUpdateIntegrationsInDB,
  getPublicIntegrationsFromDB,
};