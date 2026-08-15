import { User } from '@/lib/modules/user/user.model';
import { TUser } from '@/lib/modules/user/user.interface';

const getAllActiveServiceProvidersFromDB = async (): Promise<Partial<TUser>[]> => {
  const result = await User.find({ role: 'service-provider', isDeleted: false })
    .select('-password')
    .sort({ createdAt: -1 });
  return result;
};

const getServiceProviderProfileFromDB = async (serviceProviderId: string): Promise<Partial<TUser> | null> => {
  const result = await User.findById(serviceProviderId)
    .where({ role: 'service-provider', isDeleted: false })
    .select('-password');
  return result;
};

// ✅ MAGIC FIX: Hard Delete Logic Add করা হলো
const deleteServiceProviderFromDB = async (id: string) => {
  // findByIdAndDelete ব্যবহার করে ডাটাবেস থেকে চিরতরে মুছে ফেলা হলো
  const result = await User.findByIdAndDelete(id);
  if (!result) throw new Error("Provider not found or already deleted");
  return result;
};

export const ServiceProviderServices = {
  getAllActiveServiceProvidersFromDB,
  getServiceProviderProfileFromDB,
  deleteServiceProviderFromDB, // ✅ Exported
};