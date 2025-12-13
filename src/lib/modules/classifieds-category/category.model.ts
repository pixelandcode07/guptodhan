import { Schema, model, models } from 'mongoose';
import { IClassifiedCategory } from './category.interface';

const classifiedCategorySchema = new Schema<IClassifiedCategory>({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  orderCount:{type:Number, required: false, default: 0}
}, { timestamps: true });

export const ClassifiedCategory = models.ClassifiedCategory || model<IClassifiedCategory>('ClassifiedCategory', classifiedCategorySchema);