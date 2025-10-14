import { Schema, model, models } from 'mongoose';
import { IDeviceCondition } from '../interfaces/deviceCondition.interface';

const deviceConditionSchema = new Schema<IDeviceCondition>(
  {
    deviceCondition: { type: String, required: true },
  },
  { timestamps: true }
);

export const DeviceConditionModel =
  models.DeviceConditionModel || model<IDeviceCondition>('DeviceConditionModel', deviceConditionSchema);
