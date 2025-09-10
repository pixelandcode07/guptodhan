// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\message\message.interface.ts
import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  isRead: boolean;
}