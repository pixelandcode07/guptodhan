import { Document } from 'mongoose';

export interface IPromoCode extends Document {
  promoCodeId: string;
  title: string;
  icon: string;
  startDate: Date;
  endingDate: Date;
  type: string;
  shortDescription: string;
  value: number;
  minimumOrderAmount: number;
  code: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}
