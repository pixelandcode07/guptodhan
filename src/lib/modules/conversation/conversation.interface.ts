import { Document, Types } from 'mongoose';

export interface IConversation extends Document {
  ad: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
}