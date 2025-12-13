import { Document } from 'mongoose';

export interface IUpazilaThana extends Document {
  district: string;
  upazilaThanaEnglish: string;
  upazilaThanaBangla: string;
  websiteLink: string;
  createdAt: Date;
}
