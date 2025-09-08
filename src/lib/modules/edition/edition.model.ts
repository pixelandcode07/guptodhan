// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\edition\edition.model.ts
import { Schema, model, models } from 'mongoose';
import { IEdition } from './edition.interface';

const editionSchema = new Schema<IEdition>({
  name: { type: String, required: true },
  productModel: { type: Schema.Types.ObjectId, ref: 'ProductModel', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const Edition = models.Edition || model<IEdition>('Edition', editionSchema);