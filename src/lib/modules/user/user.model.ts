import { Model, Schema, model, Document, models } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser } from './user.interface';

export type TUserDoc = TUser & Document & {
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
};

export interface UserModel extends Model<TUserDoc> {
  isUserExistsByEmail(email: string): Promise<TUserDoc | null>;
}

const userSchema = new Schema<TUserDoc, UserModel>(
   {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },   
    password: { type: String, select: false },   
    phoneNumber: { type: String, unique: true, sparse: true },    
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

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password as string, 12);
  }
  next();
});

userSchema.statics.isUserExistsByEmail = async function (
  email: string
): Promise<TUserDoc | null> {
  return this.findOne({ email }).select('+password');
};

userSchema.methods.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const User: UserModel = (models.User || model<TUserDoc, UserModel>('User', userSchema)) as UserModel;
