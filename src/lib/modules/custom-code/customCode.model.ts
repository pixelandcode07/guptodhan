// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\custom-code\customCode.model.ts

import { Schema, model, models } from 'mongoose';
import { ICustomCode } from './customCode.interface';

const customCodeSchema = new Schema<ICustomCode>({
  customCSS: { type: String },
  headerScript: { type: String },
  footerScript: { type: String },
}, { timestamps: true });

export const CustomCode = models.CustomCode || model<ICustomCode>('CustomCode', customCodeSchema);