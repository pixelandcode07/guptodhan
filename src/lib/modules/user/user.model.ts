import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUserDoc, UserModel } from './user.interface';

const userSchema = new Schema<TUserDoc, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, sparse: true, unique: true, index: true },
    password: { type: String, select: false }, // default query তে আসবে না
    phoneNumber: { type: String, unique: true, sparse: true, index: true },
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

// ===========================
// 🔐 PASSWORD HASH MIDDLEWARE
// ===========================

userSchema.pre('save', async function (next) {
  const user = this as TUserDoc;

  // যদি পাসওয়ার্ড ফিল্ডটি পরিবর্তন না হয়, তবে হ্যাশ করার দরকার নেই
  if (!user.isModified('password')) {
    return next();
  }

  try {
    const saltRounds = 10;
    // পাসওয়ার্ড হ্যাশ করা হচ্ছে
    const hashedPassword = await bcrypt.hash(user.password as string, saltRounds);
    user.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

// ===========================
// 🔎 USER EXIST CHECKERS
// ===========================

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return this.findOne({ email }).select('+password');
};

userSchema.statics.isUserExistsByPhone = async function (phone: string) {
  return this.findOne({ phoneNumber: phone }).select('+password');
};

// ===========================
// 🔑 PASSWORD MATCH METHOD
// ===========================

userSchema.methods.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// ===========================
// EXPORT USER MODEL
// ===========================

export const User: UserModel = (models.User || model<TUserDoc, UserModel>('User', userSchema)) as UserModel;