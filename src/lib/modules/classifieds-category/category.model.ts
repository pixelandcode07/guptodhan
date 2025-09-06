// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds\category.model.ts
import { Schema, model, models } from 'mongoose';
import { IClassifiedCategory } from './category.interface';

const classifiedCategorySchema = new Schema<IClassifiedCategory>({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const ClassifiedCategory = models.ClassifiedCategory || model<IClassifiedCategory>('ClassifiedCategory', classifiedCategorySchema);