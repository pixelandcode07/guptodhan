import { Schema, model, models } from 'mongoose';
import { IChildCategory } from '../interfaces/ecomChildCategory.interface';
import './ecomCategory.model'; // Import to ensure CategoryModel is registered
import './ecomSubCategory.model'; // Import to ensure SubCategoryModel is registered

const childCategorySchema = new Schema<IChildCategory>(
  {
    childCategoryId: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'CategoryModel', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategoryModel', required: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String }, // Made optional
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ChildCategoryModel =
  models.ChildCategoryModel || model<IChildCategory>('ChildCategoryModel', childCategorySchema);
