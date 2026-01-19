import { Schema, model, models } from 'mongoose';
import { IEcommerceBanner } from './banner.interface';

const bannerSchema = new Schema<IEcommerceBanner>({
  bannerImage: { type: String, required: true },
  bannerPosition: { type: String, enum: ['top-homepage', 'left-homepage', 'right-homepage', 'middle-homepage', 'bottom-homepage', 'top-shoppage'], required: true },
  textPosition: { type: String, enum: ['left', 'right'], required: true },
  bannerLink: { type: String },
  subTitle: { type: String },
  bannerTitle: { type: String, required: true },
  bannerDescription: { type: String },
  buttonText: { type: String },
  buttonLink: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  orderCount: { type: Number, default: 0 }
}, { timestamps: true });

// ===================================
// 🔥 INDEXING FOR SPEED
// ===================================

// 1️⃣ Public Query Optimization:
// আমরা কুয়েরি করি: find({ bannerPosition: '...', status: 'active' }).sort({ orderCount: 1 })
// তাই এই ৩টি ফিল্ড মিলে Compound Index বানালে কুয়েরি সুপার ফাস্ট হবে।
bannerSchema.index({ bannerPosition: 1, status: 1, orderCount: 1 });

// 2️⃣ Admin Panel Optimization:
// এডমিন প্যানেলে সব ব্যানার সর্ট করে দেখানোর জন্য
bannerSchema.index({ orderCount: 1 });

export const EcommerceBanner = models.EcommerceBanner || model<IEcommerceBanner>('EcommerceBanner', bannerSchema);