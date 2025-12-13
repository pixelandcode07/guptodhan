import { Schema, model, models } from 'mongoose';
import { IPKSlider } from './sliderForm.interface';

const pkSliderSchema = new Schema<IPKSlider>(
  {
    sliderId: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    textPosition: { type: String, required: true },
    sliderLink: { type: String, required: true },
    subTitleWithColor: { type: String, required: true },
    bannerTitleWithColor: { type: String, required: true },
    bannerDescriptionWithColor: { type: String, required: true },
    buttonWithColor: { type: String, required: true },
    buttonLink: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    orderCount: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

export const PKSliderModel =
  models.PKSliderModel || model<IPKSlider>('PKSliderModel', pkSliderSchema);
