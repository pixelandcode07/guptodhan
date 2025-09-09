// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-provider\serviceProvider.interface.ts

import { Document, Types, Model } from 'mongoose';

export interface IServiceProvider {
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  profilePicture?: string;
  bio?: string;
  skills: string[];
  cvUrl?: string;
  ratingAvg: number;
  isVerified: boolean;
  isActive: boolean;
}

// Mongoose Document এবং কাস্টম মেথডের জন্য টাইপ
export interface IServiceProviderDoc extends IServiceProvider, Document {
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

// কাস্টম স্ট্যাটিক মেথডের জন্য ইন্টারফেস
export interface IServiceProviderModel extends Model<IServiceProviderDoc> {
  isProviderExistsByEmail(email: string): Promise<IServiceProviderDoc | null>;
}