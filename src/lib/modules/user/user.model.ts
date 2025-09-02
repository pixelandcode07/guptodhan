import { Model, Schema, model, Document, models } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser } from './user.interface';

// Document + instance methods
export type TUserDoc = TUser & Document & {
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
};

// Custom static methods
export interface UserModel extends Model<TUserDoc> {
  isUserExistsByEmail(email: string): Promise<TUserDoc | null>;
}

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
    role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
    rewardPoints: { type: Number, default: 0 },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true }
);

// Pre-save middleware: hash password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password as string, 12);
  }
  next();
});

// Static method: find user by email
userSchema.statics.isUserExistsByEmail = async function (
  email: string
): Promise<TUserDoc | null> {
  return this.findOne({ email }).select('+password');
};

// Instance method: compare password
userSchema.methods.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Export model with type assertion to avoid TypeScript errors
export const User: UserModel = (models.User || model<TUserDoc, UserModel>('User', userSchema)) as UserModel;
