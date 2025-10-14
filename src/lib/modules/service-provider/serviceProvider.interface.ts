import { Document, Model, Types } from 'mongoose';

export interface IServiceProvider {
  name: string;
  email: string;
  role: 'service-provider';
  password?: string;
  phoneNumber: string;
  address: string;
  serviceCategory: Types.ObjectId;
  subCategories: Types.ObjectId[];
  profilePicture?: string;
  bio?: string;
  cvUrl?: string;
  ratingAvg: number;
  isVerified: boolean;
  isActive: boolean;
}

export interface IServiceProviderDoc extends IServiceProvider, Document {
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export interface IServiceProviderModel extends Model<IServiceProviderDoc> {
  isProviderExistsByEmail(email: string): Promise<IServiceProviderDoc | null>;
}
