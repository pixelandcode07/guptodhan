/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { TUserInput, TUser } from './user.interface';
import { User } from './user.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import bcrypt from 'bcrypt'; // <-- bcrypt ইম্পোর্ট

// আগের সব ফাংশন অপরিবর্তিত থাকবে
const createUserIntoDB = async (payload: TUserInput): Promise<Partial<TUser> | null> => {
  const query = [];
  if (payload.email) query.push({ email: payload.email });
  if (payload.phoneNumber) query.push({ phoneNumber: payload.phoneNumber });

  if (query.length > 0) {
    const isUserExist = await User.findOne({ $or: query });
    if (isUserExist) {
      throw new Error('A user with this email or phone number already exists!');
    }
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const payloadWithHashedPassword = { ...payload, password: hashedPassword };

  const newUser = await User.create(payloadWithHashedPassword);
  return User.findById(newUser._id).select('-password');
};

const getMyProfileFromDB = async (userId: string): Promise<Partial<TUser> | null> => {
  const result = await User.findById(userId).select('-password');
  return result;
};

const updateMyProfileInDB = async (userId: string, payload: Partial<TUser>): Promise<Partial<TUser> | null> => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found!');
  if (payload.profilePicture && user.profilePicture) await deleteFromCloudinary(user.profilePicture);

  return User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).select('-password');
};

const getAllUsersFromDB = async (): Promise<TUser[]> => {
  return User.find({ isDeleted: false }).select('-password');
};

const deleteUserFromDB = async (id: string): Promise<Partial<TUser> | null> => {
  return User.findByIdAndUpdate(
    id,
    { isDeleted: true, isActive: false },
    { new: true }
  ).select('-password');
};

// ✅ নতুন ফাংশন: Service Provider Create
// Service Provider Create
const createServiceProviderIntoDB = async (payload: any) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const userPayload: any = {
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    phoneNumber: payload.phoneNumber,
    address: payload.address,
    role: 'service-provider',
  };

  // serviceProviderInfo তৈরি শুধুমাত্র valid data থাকলে
  if (payload.serviceCategory || (Array.isArray(payload.subCategories) && payload.subCategories.length > 0) || payload.cvUrl || payload.bio) {
    const serviceProviderInfo: any = {};

    if (payload.serviceCategory) {
      serviceProviderInfo.serviceCategory = new Types.ObjectId(payload.serviceCategory);
    }

    if (Array.isArray(payload.subCategories) && payload.subCategories.length > 0) {
      serviceProviderInfo.subCategories = payload.subCategories.map((id: string) => new Types.ObjectId(id));
    }

    if (payload.cvUrl) serviceProviderInfo.cvUrl = payload.cvUrl;
    serviceProviderInfo.bio = payload.bio || '';

    // শুধু তখনই assign করো যখন object এ অন্তত একটি field আছে
    if (Object.keys(serviceProviderInfo).length > 0) {
      userPayload.serviceProviderInfo = serviceProviderInfo;
    }
  }

  const newUser = await User.create(userPayload);
  return User.findById(newUser._id).select('-password');
};




export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
  deleteUserFromDB,
  createServiceProviderIntoDB, // <-- শুধু add করা
};
