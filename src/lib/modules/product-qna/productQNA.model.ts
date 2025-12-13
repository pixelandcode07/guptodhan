import { Schema, model, models } from 'mongoose';
import { IProductQA } from './productQNA.interface';

const productQASchema = new Schema<IProductQA>(
  {
    qaId: { type: String, required: true, unique: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    userImage: { type: String },
    question: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['active' , 'inactive'], 
      default: 'active' 
    },
    answer: {
      answeredByName: { type: String, trim: true },
      answeredByEmail: { type: String, trim: true },
      answerText: { type: String, trim: true },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

export const ProductQAModel =
  models.ProductQAModel || model<IProductQA>('ProductQAModel', productQASchema);
