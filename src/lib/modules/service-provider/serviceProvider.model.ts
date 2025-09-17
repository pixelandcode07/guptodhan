import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';
import { IServiceProviderDoc, IServiceProviderModel } from './serviceProvider.interface';

const serviceProviderSchema = new Schema<IServiceProviderDoc, IServiceProviderModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['service-provider'], default: 'service-provider' },
  password: { type: String, required: true, select: false },
  phoneNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  profilePicture: { type: String },
  serviceCategory: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
  subCategories: [{ type: Schema.Types.ObjectId, ref: 'ServiceSubCategory', required: true }],
  bio: { type: String },
  cvUrl: { type: String },
  ratingAvg: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

serviceProviderSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

serviceProviderSchema.statics.isProviderExistsByEmail = async function(email: string): Promise<IServiceProviderDoc | null> {
  return await this.findOne({ email }).select('+password');
};

serviceProviderSchema.methods.isPasswordMatched = async function(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const ServiceProvider =
  (models.ServiceProvider as IServiceProviderModel) ||
  model<IServiceProviderDoc, IServiceProviderModel>('ServiceProvider', serviceProviderSchema);
