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
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};