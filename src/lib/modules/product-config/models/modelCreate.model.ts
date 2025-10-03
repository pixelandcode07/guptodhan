import { Schema, model, models } from 'mongoose';
import { IModelForm } from '../interfaces/modelCreate.interface';

const modelFormSchema = new Schema<IModelForm>(
  {
    modelFormId: { type: String, required: true, unique: true },
    brand: { type: Schema.Types.ObjectId, ref: 'BrandModel', required: true },
    brandName: { type: String, required: true, trim: true },
    modelName: { type: String, required: true, trim: true },
    modelCode: { type: String, required: true, unique: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const ModelForm =
  models.ModelForm || model<IModelForm>('ModelForm', modelFormSchema);
