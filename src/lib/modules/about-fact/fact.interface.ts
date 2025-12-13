// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-fact\fact.interface.ts
import { Document } from 'mongoose';

export interface IAboutFact extends Document {
  factTitle: string;
  factCount: number;
  shortDescription?: string;
  status: 'active' | 'inactive';
}
