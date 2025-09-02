
import { Document, Types } from 'mongoose';

export type TUser = {
  _id: Types.ObjectId;
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

export type TUserInput = Omit<
  TUser,
  '_id' | 'isDeleted' | 'isVerified' | 'isActive' | 'rewardPoints' | 'loginTime' | 'passwordChangedAt' | 'password'
> & { password: string };


export type TUserDoc = TUser & Document & {
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
};