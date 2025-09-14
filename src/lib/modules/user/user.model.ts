import { Model, Schema, model, Document, models } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser } from './user.interface';

export type TUserDoc = TUser & Document & {
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
};

export interface UserModel extends Model<TUserDoc> {
  isUserExistsByEmail(email: string): Promise<TUserDoc | null>;
  isUserExistsByPhone(phone: string): Promise<TUserDoc | null>; // <-- এই লাইনটি যোগ করুন
}

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
    role: { type: String, 
    enum: ['user', 'vendor', 'service-provider', 'admin'], 
    default: 'user' },
    rewardPoints: { type: Number, default: 0 },
    passwordChangedAt: { type: Date },
    vendorInfo: {
    type: Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    serviceProviderInfo: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceProvider',
    },
  },
  { timestamps: true },
);

// একটি validation যোগ করা হচ্ছে যা নিশ্চিত করে যে email অথবা phoneNumber যেকোনো একটি আছে
userSchema.pre('validate', function(next) {
    if (!this.email && !this.phoneNumber) {
        next(new Error('Either email or phone number must be provided.'));
    } else {
        next();
    }
});

userSchema.statics.isUserExistsByEmail = async function (
  email: string
): Promise<TUserDoc | null> {
  return this.findOne({ email }).select('+password');
};

userSchema.statics.isUserExistsByPhone = async function (
  phone: string,
): Promise<TUserDoc | null> {
  return this.findOne({ phoneNumber: phone }).select('+password');
};

userSchema.methods.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const User: UserModel = (models.User || model<TUserDoc, UserModel>('User', userSchema)) as UserModel;