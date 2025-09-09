// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-provider\serviceProvider.model.ts

import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';
import { IServiceProvider, IServiceProviderDoc, IServiceProviderModel } from './serviceProvider.interface';

const serviceProviderSchema = new Schema<IServiceProviderDoc, IServiceProviderModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phoneNumber: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  bio: { type: String },
  skills: [{ type: String, required: true }],
  cvUrl: { type: String },
  ratingAvg: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// ডেটাবেসে সেভ করার আগে পাসওয়ার্ড হ্যাশ করা হচ্ছে
serviceProviderSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password as string, 12);
  }
  next();
});

// স্ট্যাটিক মেথড: ইমেইল দিয়ে সার্ভিস প্রোভাইডার খোঁজার জন্য
serviceProviderSchema.statics.isProviderExistsByEmail = async function (email: string) {
  return await this.findOne({ email }).select('+password');
};

// ইনস্ট্যান্স মেথড: পাসওয়ার্ড মেলানোর জন্য
serviceProviderSchema.methods.isPasswordMatched = async function (plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const ServiceProvider = models.ServiceProvider || model<IServiceProviderDoc, IServiceProviderModel>('ServiceProvider', serviceProviderSchema);