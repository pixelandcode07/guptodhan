// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\user\user.model.ts

import { Model, Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser } from './user.interface';

// সমাধান: TUserDoc নামে একটি নতুন টাইপ তৈরি করা হয়েছে যা Mongoose Document এবং TUser উভয়কেই যুক্ত করে
export type TUserDoc = TUser & Document & {
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
};

// কাস্টম স্ট্যাটিক মেথডের জন্য ইন্টারফেস
export interface UserModel extends Model<TUserDoc> {
  isUserExistsByEmail(email: string): Promise<TUserDoc | null>;
}

// সমাধান: স্কিমা এবং মডেলে এখন TUserDoc টাইপ ব্যবহার করা হচ্ছে
const userSchema = new Schema<TUserDoc, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    address: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      default: 'user',
    },
    rewardPoints: { type: Number, default: 0 },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true },
);

// Password hashing middleware (অপরিবর্তিত)
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password as string, 12);
  }
  next();
});

// Static method to check if user exists
// সমাধান: স্ট্যাটিক মেথডের রিটার্ন টাইপ TUserDoc করা হয়েছে
userSchema.statics.isUserExistsByEmail = async function (
  email: string,
): Promise<TUserDoc | null> {
  return await this.findOne({ email }).select('+password');
};

// Instance method to compare password (অপরিবর্তিত)
userSchema.methods.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const User = model<TUserDoc, UserModel>('User', userSchema);