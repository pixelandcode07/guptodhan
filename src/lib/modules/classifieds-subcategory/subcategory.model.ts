
import { Schema, model, models } from 'mongoose';
import { IClassifiedSubCategory } from './subcategory.interface';

const classifiedSubCategorySchema = new Schema<IClassifiedSubCategory>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'ClassifiedCategory', required: true },
  icon: { type: String }, 
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const ClassifiedSubCategory = models.ClassifiedSubCategory || model<IClassifiedSubCategory>('ClassifiedSubCategory', classifiedSubCategorySchema);