// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\user\user.interface.ts

import { Document, Types } from 'mongoose';

// ডেটাবেসের একটি সম্পূর্ণ User Document-কে বোঝাবে
export type TUser = {
  _id: Types.ObjectId; // _id যোগ করা হয়েছে
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  profilePicture?: string;
  address: string;
  isDeleted: boolean;
  isVerified: boolean;
  isActive: boolean;
  role: 'user' | 'vendor' | 'admin';
  rewardPoints: number;
  loginTime?: Date;
  passwordChangedAt?: Date;
};

// নতুন ইউজার তৈরির ইনপুটকে বোঝাবে
export type TUserInput = Omit<
  TUser,
  '_id' | 'isDeleted' | 'isVerified' | 'isActive' | 'rewardPoints' | 'loginTime' | 'passwordChangedAt' | 'password'
> & { password: string };


// Mongoose Document এবং কাস্টম মেথডের জন্য টাইপ
export type TUserDoc = TUser & Document & {
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
};