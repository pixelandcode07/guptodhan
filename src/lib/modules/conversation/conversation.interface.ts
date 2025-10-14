// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\conversation\conversation.interface.ts
import { Document, Types } from 'mongoose';

export interface IConversation extends Document {
  ad: Types.ObjectId; // কোন বিজ্ঞাপনের জন্য চ্যাট
  participants: Types.ObjectId[]; // [buyerId, sellerId]
  lastMessage?: Types.ObjectId;
}