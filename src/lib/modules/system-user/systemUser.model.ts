import { Schema, model, models } from 'mongoose';
import { IUser } from './systemUser.interface';

const userSchema = new Schema<IUser>(
  {
    systemUserID: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['admin', 'user', 'agent'], default: 'user' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel = models.UserModel || model<IUser>('UserModel', userSchema);
