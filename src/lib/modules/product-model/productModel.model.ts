// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\product-model\productModel.model.ts
import { Schema, model, models } from 'mongoose';
import { IProductModel } from './productModel.interface';

const productModelSchema = new Schema<IProductModel>({
  name: { type: String, required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const ProductModel = models.ProductModel || model<IProductModel>('ProductModel', productModelSchema);