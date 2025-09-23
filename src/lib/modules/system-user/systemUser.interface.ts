import { Document } from 'mongoose';

export interface IUser extends Document {
  systemUserID: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  createdAt: Date;
  userType: 'admin' | 'user' | 'agent';
  isActive: boolean;
}
