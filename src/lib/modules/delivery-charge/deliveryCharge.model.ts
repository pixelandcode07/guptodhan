import { Schema, model, models } from 'mongoose';
import { IDeliveryCharge } from './deliveryCharge.interface';

const deliveryChargeSchema = new Schema<IDeliveryCharge>(
  {
    divisionName: { type: String, required: true, trim: true },
    districtName: { type: String, required: true, trim: true },
    districtNameBangla: { type: String, required: true, trim: true },
    deliveryCharge: { type: Number, required: true },
  },
  { timestamps: true }
);

export const DeliveryChargeModel =
  models.DeliveryChargeModel || model<IDeliveryCharge>('DeliveryChargeModel', deliveryChargeSchema);
