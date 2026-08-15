/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { TUserInput, TUser } from './user.interface';
import { User } from './user.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import { getCachedData, deleteCacheKey, deleteCachePattern } from '@/lib/redis/cache-helpers';
import { CacheKeys, CacheTTL } from '@/lib/redis/cache-keys';
import '@/lib/modules/service-category/serviceCategory.model';
import '@/lib/modules/service-subcategory/serviceSubCategory.model';

/**
 * 🆕 User Registration with Email/Phone Check Optimization
 */
const createUserIntoDB = async (payload: TUserInput): Promise<Partial<TUser> | null> => {
  const query = [];
  if (payload.email) query.push({ email: payload.email });
  if (payload.phoneNumber) query.push({ phoneNumber: payload.phoneNumber });

  if (query.length > 0) {
    const isUserExist = await User.findOne({ $or: query }).lean();
    if (isUserExist) {
      throw new Error('A user with this email or phone number already exists!');
    }
  }

  // ✅ MAGIC FIX: Mark hasPassword as true. pre-save hook will hash the plain password.
  payload.hasPassword = true;
  
  const newUser = await User.create(payload);
  
  const result = await User.findById(newUser._id)
    .select('-password')
    .lean();

  return result;
};

/**
 * 👤 Get User Profile with Redis Caching
 * Cache Strategy: 30 minutes TTL
 */
const getMyProfileFromDB = async (userId: string): Promise<Partial<TUser> | null> => {
  const cacheKey = CacheKeys.USER.PROFILE(userId);

  return getCachedData(
    cacheKey,
    async () => {
      const user = await User.findById(userId)
        .select('-password')
        .lean();
      
      return user;
    },
    CacheTTL.USER_PROFILE // 30 minutes
  );
};

/**
 * ✏️ Update Profile with Cache Invalidation
 */
const updateMyProfileInDB = async (
  userId: string,
  payload: Partial<TUser>
): Promise<Partial<TUser> | null> => {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error('User not found!');

  if (payload.profilePicture && user.profilePicture) {
    try {
      await deleteFromCloudinary(user.profilePicture);
    } catch(err) {
      console.warn("Cloudinary delete failed:", err);
    }
  }

  const updateData: any = { ...payload };

  const result = await User.findByIdAndUpdate(
    userId, 
    { $set: updateData }, 
    {
      new: true,
      runValidators: true,
    }
  )
    .select('-password')
    .lean();

  try {
    if (typeof deleteCacheKey === 'function') {
      await deleteCacheKey(`user:profile:${userId}`);
      if (payload.email) {
        await deleteCacheKey(`user:email:${payload.email}`);
      }
      if (payload.phoneNumber) {
        await deleteCacheKey(`user:phone:${payload.phoneNumber}`);
      }
    }
  } catch (error) {
    console.warn("Cache clear failed:", error);
  }

  return result;
};

/**
 * 📋 Get All Users (Admin) - No Caching (Real-time data needed)
 */
const getAllUsersFromDB = async (): Promise<TUser[]> => {
  return User.find({ isDeleted: false })
    .select('-password')
    .sort({ createdAt: -1 }) 
    .lean();
};

/**
 * 🗑️ Delete User with Cache Invalidation
 */
const deleteUserFromDB = async (id: string): Promise<Partial<TUser> | null> => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true, isActive: false },
    { new: true }
  )
    .select('-password')
    .lean();

  await deleteCacheKey(CacheKeys.USER.PROFILE(id));
  await deleteCachePattern(CacheKeys.PATTERNS.USERS_LIST);

  return result;
};

/**
 * 🛠️ Service Provider Registration
 */
const createServiceProviderIntoDB = async (payload: any) => {
  // ❌ REMOVED EXPLICIT HASHING TO PREVENT DOUBLE HASHING
  // const hashedPassword = await bcrypt.hash(payload.password, 12);

  const userPayload: any = {
    name: payload.name,
    email: payload.email,
    password: payload.password, // ✅ Plain password, pre('save') hook will hash it ONCE
    hasPassword: true, // ✅ Set to true
    phoneNumber: payload.phoneNumber,
    address: payload.address,
    role: 'service-provider',
  };

  if (
    payload.serviceCategory ||
    (Array.isArray(payload.subCategories) && payload.subCategories.length > 0) ||
    payload.cvUrl ||
    payload.bio
  ) {
    const serviceProviderInfo: any = {};

    if (payload.serviceCategory) {
      serviceProviderInfo.serviceCategory = new Types.ObjectId(payload.serviceCategory);
    }

    if (Array.isArray(payload.subCategories) && payload.subCategories.length > 0) {
      serviceProviderInfo.subCategories = payload.subCategories.map(
        (id: string) => new Types.ObjectId(id)
      );
    }

    if (payload.cvUrl) serviceProviderInfo.cvUrl = payload.cvUrl;
    serviceProviderInfo.bio = payload.bio || '';

    if (Object.keys(serviceProviderInfo).length > 0) {
      userPayload.serviceProviderInfo = serviceProviderInfo;
    }
  }

  const newUser = await User.create(userPayload);
  
  return User.findById(newUser._id)
    .select('-password')
    .lean();
};

/**
 * 👨‍💼 Admin Update User
 */
const updateUserByAdminInDB = async (
  id: string,
  payload: Partial<TUser>
): Promise<Partial<TUser> | null> => {
  const user = await User.findById(id).lean();
  if (!user) throw new Error('User not found!');

  if (payload.password) {
    delete payload.password;
  }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .select('-password')
    .lean();

  await deleteCacheKey(CacheKeys.USER.PROFILE(id));

  return result;
};

/**
 * 🔍 Get User by ID
 */
const getUserByIdFromDB = async (id: string): Promise<Partial<TUser> | null> => {
  const user = await User.findById(id)
    .select('-password')
    .lean();

  return user;
};


/**
 * 👑 Create User By Admin (Directly Verified, No OTP)
 */
const createUserByAdminInDB = async (payload: any): Promise<Partial<TUser> | null> => {
  const query = [];
  if (payload.email) query.push({ email: payload.email });
  if (payload.phoneNumber) query.push({ phoneNumber: payload.phoneNumber });

  if (query.length > 0) {
    const isUserExist = await User.findOne({ $or: query }).lean();
    if (isUserExist) {
      throw new Error('A user with this email or phone number already exists!');
    }
  }

  payload.isVerified = true;
  payload.isActive = true;
  payload.hasPassword = true; // ✅ Mark hasPassword

  const newUser = await User.create(payload);
  
  await deleteCachePattern(CacheKeys.PATTERNS.USERS_LIST);

  const result = await User.findById(newUser._id)
    .select('-password')
    .lean();

  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
  deleteUserFromDB,
  createServiceProviderIntoDB,
  updateUserByAdminInDB,
  getUserByIdFromDB,
  createUserByAdminInDB,
};