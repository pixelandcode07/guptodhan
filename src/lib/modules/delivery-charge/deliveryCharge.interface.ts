import { Document } from 'mongoose';

export interface IDeliveryCharge extends Document {
  divisionName: string;
  districtName: string;
  districtNameBangla: string;
  deliveryCharge: number;
  createdAt: Date;
}
