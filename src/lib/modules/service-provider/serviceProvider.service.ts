import { User } from '@/lib/modules/user/user.model';
import { TUser } from '@/lib/modules/user/user.interface';

const getAllActiveServiceProvidersFromDB = async (): Promise<Partial<TUser>[]> => {
  // ✅ MAGIC FIX: `isActive: true` রিমুভ করা হলো যাতে Pending/Inactive প্রোভাইডারদেরকেও লিস্টে দেখা যায়
  // এবং isDeleted: false রাখা হলো যাতে ডিলিট হওয়া ডাটা লিস্টে না আসে
  const result = await User.find({ role: 'service-provider', isDeleted: false })
    .select('-password')
    .sort({ createdAt: -1 }); // নতুন রিকোয়েস্টগুলো উপরে দেখাবে
    
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