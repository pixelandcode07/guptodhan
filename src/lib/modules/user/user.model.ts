import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUserDoc, UserModel } from './user.interface';

const userSchema = new Schema<TUserDoc, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, sparse: true, unique: true, index: true },
    password: { type: String, select: false },
    phoneNumber: { type: String, unique: true, sparse: true, index: true },
    profilePicture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'vendor', 'service-provider', 'admin'], default: 'user' },
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

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return this.findOne({ email }).select('+password');
};
userSchema.statics.isUserExistsByPhone = async function (phone: string) {
  return this.findOne({ phoneNumber: phone }).select('+password');
};
userSchema.methods.isPasswordMatched = async function (plainPassword: string, hashedPassword: string) {
  if (!hashedPassword) return false;
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const User: UserModel = (models.User || model<TUserDoc, UserModel>('User', userSchema)) as UserModel;
