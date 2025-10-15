import { Document } from 'mongoose';

export interface IContactRequest extends Document {
  userName: string;
  userEmail?: string;
  userNumber?: string;
  message: string;
  status: 'pending' | 'resolved';
  createdAt: Date;
}
