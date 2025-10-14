import { Document } from 'mongoose';

export interface IDeviceCondition extends Document {
  deviceCondition: string;
  createdAt: Date;
}
