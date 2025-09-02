// ফাইল পাথ: src/lib/modules/user/user.service.ts

import { TUser, TUserInput } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (payload: TUserInput): Promise<Partial<TUser> | null> => {
  // চেক করা হচ্ছে ইউজার আগে থেকেই আছে কিনা
  const isUserExist = await User.findOne({ email: payload.email });

  if (isUserExist) {
    throw new Error('User with this email already exists!');
  }

  // ধাপ ১: ইউজার তৈরি করা হলো
  const newUser = await User.create(payload);

  // সমাধান: তৈরি করা ইউজারকে আবার ডেটাবেস থেকে খুঁজে বের করা হচ্ছে,
  // কিন্তু এবার পাসওয়ার্ড ফিল্ডটি বাদ দিয়ে (`.select('-password')`)
  const result = await User.findById(newUser._id).select('-password');

  return result;
};

const getAllUsersFromDB = async (): Promise<TUser[]> => {
  const result = await User.find({ isDeleted: false });
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


const deleteUserFromDB = async (id: string): Promise<TUser | null> => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};


export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};