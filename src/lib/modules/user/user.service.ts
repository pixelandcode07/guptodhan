// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\user\user.service.ts

import { TUser, TUserInput } from './user.interface';
import { User } from './user.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import bcrypt from 'bcrypt'; // <-- bcrypt ইম্পোর্ট করুন

const createUserIntoDB = async (payload: TUserInput): Promise<Partial<TUser> | null> => {
    // ইমেইল বা ফোন নম্বর আগে থেকেই আছে কিনা তা চেক করা হচ্ছে
    const query = [];
    if (payload.email) query.push({ email: payload.email });
    if (payload.phoneNumber) query.push({ phoneNumber: payload.phoneNumber });

    if (query.length > 0) {
        const isUserExist = await User.findOne({ $or: query });
        if (isUserExist) {
            throw new Error('A user with this email or phone number already exists!');
        }
    }
    
    // সমাধান: পাসওয়ার্ডটি সার্ভিস লেয়ারেই হ্যাশ করা হচ্ছে
    // Mongoose hook-এর উপর আর নির্ভর করা হচ্ছে না
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    
    // হ্যাশ করা পাসওয়ার্ড দিয়ে নতুন payload তৈরি করা হচ্ছে
    const payloadWithHashedPassword = {
        ...payload,
        password: hashedPassword,
    };
    
    const newUser = await User.create(payloadWithHashedPassword);
    
    const result = await User.findById(newUser._id).select('-password');
    return result;
};

// --- আপনার বাকি সার্ভিস ফাংশনগুলো অপরিবর্তিত থাকবে ---

const getMyProfileFromDB = async (userId: string): Promise<Partial<TUser> | null> => {
  const result = await User.findById(userId).select('-password');
  return result;
};

const updateMyProfileInDB = async (
  userId: string,
  payload: Partial<TUser>,
): Promise<Partial<TUser> | null> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found!');
  }

  if (payload.profilePicture && user.profilePicture) {
    await deleteFromCloudinary(user.profilePicture);
  }

  const result = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select('-password');
  
  return result;
};

const getAllUsersFromDB = async (): Promise<TUser[]> => {
  const result = await User.find({ isDeleted: false }).select('-password');
  return result;
};

const deleteUserFromDB = async (id: string): Promise<Partial<TUser> | null> => {
  const result = await User.findByIdAndUpdate(
    id,
    { 
      isDeleted: true,
      isActive: false, 
    },
    { new: true },
  ).select('-password'); 
  return result;
};


export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
  deleteUserFromDB,
};