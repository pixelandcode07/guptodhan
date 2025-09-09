// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-fact\fact.model.ts
import { Schema, model, models } from 'mongoose';
import { IAboutFact } from './fact.interface';

const aboutFactSchema = new Schema<IAboutFact>({
  factTitle: { type: String, required: true, unique: true },
  factCount: { type: Number, required: true },
  shortDescription: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const AboutFact = models.AboutFact || model<IAboutFact>('AboutFact', aboutFactSchema);