/* eslint-disable @typescript-eslint/no-explicit-any */
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service\service.service.ts

import { IService } from './service.interface';
import { Service } from './service.model';

const createServiceInDB = async (payload: Partial<IService>) => {
  return await Service.create(payload);
};

const getServicesByProviderFromDB = async (providerId: string) => {
  return await Service.find({ provider: providerId }).sort({ createdAt: -1 });
};

const updateServiceInDB = async (serviceId: string, providerId: string, payload: Partial<IService>) => {
  const service = await Service.findOne({ _id: serviceId, provider: providerId });
  if (!service) { throw new Error('Service not found or you are not the owner.'); }
  return await Service.findByIdAndUpdate(serviceId, payload, { new: true });
};

const deleteServiceFromDB = async (serviceId: string, providerId: string) => {
  const service = await Service.findOne({ _id: serviceId, provider: providerId });
  if (!service) { throw new Error('Service not found or you are not the owner.'); }
  await Service.findByIdAndDelete(serviceId);
  return null;
};

const searchPublicServicesFromDB = async (filters: Record<string, any>) => {
    const query: Record<string, any> = { status: 'available' };
    if (filters.category) query.category = filters.category;
    if (filters.location) query['location.district'] = new RegExp(filters.location, 'i');
    return await Service.find(query).populate('provider', 'name ratingAvg profilePicture');
};


export const ServiceServices = {
  createServiceInDB,
  getServicesByProviderFromDB,
  updateServiceInDB,
  deleteServiceFromDB,
  searchPublicServicesFromDB,
};