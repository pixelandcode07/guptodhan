import { Schema, model, models } from 'mongoose';
import { IPromoCode } from './promoCode.interface';
import { v4 as uuidv4 } from 'uuid';

const promoCodeSchema = new Schema<IPromoCode>(
  {
    promoCodeId: { type: String, required: true, unique: true, default: () => `PC-${uuidv4().replace(/-/g, '').substring(0, 8)}`},
    title: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    startDate: { type: Date, required: true },
    endingDate: { type: Date, required: true },
    type: { type: String, required: true },
    shortDescription: { type: String, required: false, trim: true },
    value: { type: Number, required: true },
    minimumOrderAmount: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const PromoCodeModel =
  models.PromoCodeModel || model<IPromoCode>('PromoCodeModel', promoCodeSchema);
