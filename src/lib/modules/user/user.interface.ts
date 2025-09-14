// ফাইল পাথ: src/lib/modules/user/user.interface.ts

import { Document, Types, Model } from 'mongoose';

// ডেটাবেসের একটি সম্পূর্ণ User Document-কে বোঝাবে
export type TUser = {
  _id: Types.ObjectId;
  name: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  profilePicture?: string;
  address: string;
  isDeleted: boolean;
  isVerified: boolean;
  isActive: boolean;
  role: 'user' | 'vendor' | 'service-provider' | 'admin';
  rewardPoints: number;
  loginTime?: Date;
  passwordChangedAt?: Date;
  vendorInfo?: Types.ObjectId;
  serviceProviderInfo?: Types.ObjectId;
};

// সমাধান: নতুন ইউজার তৈরি করার জন্য যে ইনপুটগুলো দরকার, সেগুলোকে সংজ্ঞায়িত করা হয়েছে
export type TUserInput = Omit<
  TUser,
  | '_id'
  | 'isDeleted'
  | 'isVerified'
  | 'isActive'
  | 'rewardPoints'
  | 'loginTime'
  | 'passwordChangedAt'
  | 'password'
  | 'vendorInfo'
  | 'serviceProviderInfo'
> & { password: string };


// Mongoose Document এবং কাস্টম Instance মেথডের জন্য টাইপ
export type TUserDoc = TUser & Document & {
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
};

// কাস্টম স্ট্যাটিক মেথডের জন্য ইন্টারফেস
export interface UserModel extends Model<TUserDoc> {
  isUserExistsByEmail(email: string): Promise<TUserDoc | null>;
  isUserExistsByPhone(phone: string): Promise<TUserDoc | null>;
}