import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUserDoc, UserModel } from './user.interface';

const userSchema = new Schema<TUserDoc, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, sparse: true, unique: true },
    password: { type: String, select: false },
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
// 🔥 CRITICAL INDEXES
// ===================================
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ email: 1, isActive: 1, isDeleted: 1 });
userSchema.index({ phoneNumber: 1, isActive: 1, isDeleted: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ 'serviceProviderInfo.serviceCategory': 1 });
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
  const trimmed = phone.trim();

  // ✅ যেকোনো format থেকে সব possible format বানাও
  const formats: string[] = [trimmed];

  if (trimmed.startsWith('+88')) {
    // +8801XXXXXXXX → 01XXXXXXXX এবং 8801XXXXXXXX
    formats.push('0' + trimmed.slice(3));
    formats.push(trimmed.slice(1));
  } else if (trimmed.startsWith('88') && trimmed.length >= 13) {
    // 8801XXXXXXXX → 01XXXXXXXX এবং +8801XXXXXXXX
    formats.push('0' + trimmed.slice(2));
    formats.push('+' + trimmed);
  } else if (trimmed.startsWith('0')) {
    // 01XXXXXXXX → +8801XXXXXXXX এবং 8801XXXXXXXX
    formats.push('+88' + trimmed.slice(1));
    formats.push('88' + trimmed.slice(1));
  }

  // ✅ $in দিয়ে যেকোনো format এ match হলেই user পাবে
  return this.findOne(
    { phoneNumber: { $in: formats }, isDeleted: false }
  ).select('+password');
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