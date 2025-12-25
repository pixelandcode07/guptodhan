/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { TUserInput, TUser } from '../../user/user.interface';
import { User } from '../../user/user.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import bcrypt from 'bcrypt'; 
import '@/lib/modules/service-category/serviceCategory.model'; 
import '@/lib/modules/service-subcategory/serviceSubCategory.model';

const getAllUsersFromDB = async (): Promise<TUser[]> => {
  return User.find({ role:"service-provider" }).select('-password');
};

const getAllUsersFromDBPublic = async (): Promise<TUser[]> => {
  return User.find({ role:"service-provider", isActive:true }).select('-password');
};

const getUserByIdFromDB = async (id: string): Promise<TUser | null> => {
  const result = await User.findById(id).select('-password');

  return result;
};


const promoteToServiceProviderInDB = async (userId: string): Promise<TUser | null> => {
  const result =  User.findByIdAndUpdate(
    userId,
    { role: 'service-provider', isActive: true },
    { new: true }
  ).select('-password');

  return result;
};


const demoteToServiceProviderInDB = async (userId: string): Promise<TUser | null> => {
  const result =  User.findByIdAndUpdate(
    userId,
    { role: 'user', isActive: false },
    { new: true }
  ).select('-password');

  return result;
};



export const ServiceProviderServices = {
  getAllUsersFromDB,
  getUserByIdFromDB,
  getAllUsersFromDBPublic,
  promoteToServiceProviderInDB,
  demoteToServiceProviderInDB
};