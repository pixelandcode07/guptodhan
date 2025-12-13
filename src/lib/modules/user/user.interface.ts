import { Document, Types, Model } from 'mongoose';

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
  serviceProviderInfo?: {
    serviceCategory: Types.ObjectId;
    subCategories: Types.ObjectId[];
    cvUrl?: string;
    bio?: string;
  };
};

export type TUserInput = Omit<
  TUser,
  | '_id'
  | 'isDeleted'
  | 'isVerified'
  | 'isActive'
  | 'rewardPoints'
  | 'loginTime'
  | 'passwordChangedAt'
  | 'vendorInfo'
  | 'serviceProviderInfo'
> & { password: string };

export type TUserDoc = TUser & Document & {
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
};

export interface UserModel extends Model<TUserDoc> {
  isUserExistsByEmail(email: string): Promise<TUserDoc | null>;
  isUserExistsByPhone(phone: string): Promise<TUserDoc | null>;
}
