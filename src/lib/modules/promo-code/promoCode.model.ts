import { Schema, model, models } from 'mongoose';
import { IPromoCode } from './promoCode.interface';

const promoCodeSchema = new Schema<IPromoCode>(
  {
    promoCodeId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    startDate: { type: Date, required: true },
    endingDate: { type: Date, required: true },
    type: { type: String, required: true },
    shortDescription: { type: String, required: true, trim: true },
    value: { type: Number, required: true },
    minimumOrderAmount: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const PromoCodeModel =
  models.PromoCodeModel || model<IPromoCode>('PromoCodeModel', promoCodeSchema);
