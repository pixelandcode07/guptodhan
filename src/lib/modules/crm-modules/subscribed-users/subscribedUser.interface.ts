import { Document } from 'mongoose';

export interface ISubscriber extends Document {
  userEmail: string;
  subscribedOn: Date;
  createdAt: Date;
}
