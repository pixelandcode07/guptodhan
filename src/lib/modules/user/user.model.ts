import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUserDoc, UserModel } from './user.interface';

const userSchema = new Schema<TUserDoc, UserModel>(
  {
    name: { type: String, required: true },
    // ✅ unique: true থাকার কারণে অটোমেটিক ইনডেক্স তৈরি হয়ে গেছে
    email: { type: String, sparse: true, unique: true },
    password: { type: String, select: false },
    // ✅ unique: true থাকার কারণে অটোমেটিক ইনডেক্স তৈরি হয়ে গেছে
    phoneNumber: { type: String, unique: true, sparse: true },
    profilePicture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    role: { 
      type: String, 
      enum: ['user', 'vendor', 'service-provider', 'admin'], 
      default: 'user' 
    },
    rewardPoints: { type: Number, default: 0 },
    passwordChangedAt: { type: Date },

    serviceProviderInfo: {
      serviceCategory: { type: Schema.Types.ObjectId, ref: 'ServiceCategory' },
      subCategories: [{ type: Schema.Types.ObjectId, ref: 'ServiceSubCategory' }],
      cvUrl: String,
      bio: String,
    },

    vendorInfo: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  },
  { timestamps: true }
);

// ===================================
// 🔥 CRITICAL INDEXES (Performance Optimization)
// ===================================

// ❌ REMOVED: Single email/phone indexes removed because 'unique: true' already handles them.

// 1️⃣ Role Index - Admin/Vendor panel query অপ্টিমাইজ
userSchema.index({ role: 1 });

// 2️⃣ Active Status Index - শুধু active users filter
userSchema.index({ isActive: 1 });

// 3️⃣ Deleted Status Index - isDeleted:false queries জন্য
userSchema.index({ isDeleted: 1 });

// 4️⃣ Compound Index - Login query perfect match (ESR Rule অনুসরণ)
// E (Equality) = email, S (Sort) = none, R (Range) = none
userSchema.index({ email: 1, isActive: 1, isDeleted: 1 });

// 5️⃣ Compound Index - Phone login
userSchema.index({ phoneNumber: 1, isActive: 1, isDeleted: 1 });

// 6️⃣ Compound Index - Role-based filtering with active status
userSchema.index({ role: 1, isActive: 1 });

// 7️⃣ Service Provider Queries Optimization
userSchema.index({ 'serviceProviderInfo.serviceCategory': 1 });

// 8️⃣ Timestamp Index - Recently created users (if needed)
userSchema.index({ createdAt: -1 });

// ===========================
// 🔐 PASSWORD HASH MIDDLEWARE
// ===========================
userSchema.pre('save', async function (next) {
  const user = this as TUserDoc;
  if (!user.isModified('password')) return next();

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password as string, saltRounds);
    user.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

// ===========================
// 🔎 STATIC METHODS
// ===========================
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return this.findOne({ email, isDeleted: false }).select('+password');
};

userSchema.statics.isUserExistsByPhone = async function (phone: string) {
  return this.findOne({ phoneNumber: phone, isDeleted: false }).select('+password');
};

// ===========================
// 🔑 INSTANCE METHODS
// ===========================
userSchema.methods.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const User: UserModel = (models.User || model<TUserDoc, UserModel>('User', userSchema)) as UserModel;