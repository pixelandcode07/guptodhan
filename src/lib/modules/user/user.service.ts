// ফাইল পাথ: src/lib/modules/user/user.service.ts

import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import { TUser, TUserInput } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (payload: TUserInput): Promise<Partial<TUser> | null> => {
  const isUserExist = await User.findOne({ email: payload.email });

  if (isUserExist) {
    throw new Error('User with this email already exists!');
  }

  const newUser = await User.create(payload);

  const result = await User.findById(newUser._id).select('-password');

  return result;
};

// নতুন: নিজের প্রোফাইল দেখার জন্য সার্ভিস
const getMyProfileFromDB = async (userId: string): Promise<Partial<TUser> | null> => {
  // .select('-password') দিয়ে নিশ্চিত করা হচ্ছে যেন পাসওয়ার্ড না আসে
  const result = await User.findById(userId).select('-password');
  return result;
};

// নিজের প্রোফাইল আপডেট করার সার্ভিস
const updateMyProfileInDB = async (
  userId: string,
  payload: Partial<TUser>,
): Promise<Partial<TUser> | null> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found!');
  }

  // যদি নতুন প্রোফাইল পিকচার আপলোড করা হয় এবং পুরনো একটি ছবি থাকে
  if (payload.profilePicture && user.profilePicture) {
    // পুরনো প্রোফাইল পিকচারটি Cloudinary থেকে ডিলিট করে দেওয়া হচ্ছে
    // এটি আপনার Cloudinary স্টোরেজকে পরিষ্কার রাখবে
    await deleteFromCloudinary(user.profilePicture);
  }

  const result = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select('-password');
  
  return result;
};

// অ্যাডমিনের জন্য সকল ইউজারদের তালিকা আনার সার্ভিস (পাসওয়ার্ড ছাড়া)
const getAllUsersFromDB = async (): Promise<TUser[]> => {
  const result = await User.find({ isDeleted: false }).select('-password');
  return result;
};

const getSingleUserFromDB = async (id: string): Promise<TUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<TUser>): Promise<TUser | null> => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};


// এই ফাংশনটি ব্যবহারকারী এবং অ্যাডমিন উভয়ই ব্যবহার করতে পারবে
const deleteUserFromDB = async (id: string): Promise<Partial<TUser> | null> => {
  const result = await User.findByIdAndUpdate(
    id,
    { 
      isDeleted: true,
      isActive: false, // অ্যাকাউন্ট ডিলিট হলে তাকে inactive করে দেওয়া হচ্ছে
    },
    { new: true },
  ).select('-password'); // ডিলিট করা ইউজারের তথ্য রিটার্ন করার সময় পাসওয়ার্ড বাদ দেওয়া হচ্ছে
  return result;
};


export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};