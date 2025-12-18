import { Schema, model, models } from 'mongoose';
import { IPKSlider } from './sliderForm.interface';

const pkSliderSchema = new Schema<IPKSlider>(
  {
    sliderId: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    textPosition: { type: String, required: true },
    
    // 🔗 Web Navigation (পিসি/ওয়েব ব্রাউজার)
    sliderLink: { type: String, required: true },
    buttonLink: { type: String, required: true },
    
    // 📱 App Navigation (মোবাইল অ্যাপ) - নতুন
    appRedirectType: { 
      type: String, 
      enum: ['Product', 'Category', 'Brand', 'Shop', 'ExternalUrl', 'None'], 
      default: 'None' 
    },
    appRedirectId: { type: String, default: null }, // Product ID, Category ID, Shop ID বা URL
    
    // কন্টেন্ট
    subTitleWithColor: { type: String, required: true },
    bannerTitleWithColor: { type: String, required: true },
    bannerDescriptionWithColor: { type: String, required: true },
    buttonWithColor: { type: String, required: true },
    
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    orderCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PKSliderModel =
  models.PKSliderModel || model<IPKSlider>('PKSliderModel', pkSliderSchema);
