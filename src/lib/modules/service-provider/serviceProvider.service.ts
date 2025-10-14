// D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-provider\serviceProvider.service.ts

import { User } from '@/lib/modules/user/user.model';
import { TUser } from '@/lib/modules/user/user.interface';

const getAllActiveServiceProvidersFromDB = async (): Promise<Partial<TUser>[]> => {
  const result = await User.find({ role: 'service-provider', isActive: true, isDeleted: false })
    .select('-password');
  return result;
};

const getServiceProviderProfileFromDB = async (serviceProviderId: string): Promise<Partial<TUser> | null> => {
  const result = await User.findById(serviceProviderId)
    .where({ role: 'service-provider', isDeleted: false })
    .select('-password');
  return result;
};

export const ServiceProviderServices = {
  getAllActiveServiceProvidersFromDB,
  getServiceProviderProfileFromDB,
};
