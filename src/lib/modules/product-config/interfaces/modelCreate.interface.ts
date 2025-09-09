import { Document, Types } from 'mongoose';

export interface IModelForm extends Document {
  modelFormId: string;
  brand: Types.ObjectId;
  modelName: string;
  modelCode: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}
