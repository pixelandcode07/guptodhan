// ফাইল পাথ: src/lib/modules/message/message.model.ts
import { Schema, model, models } from 'mongoose';
import { IMessage } from './message.interface';

const messageSchema = new Schema<IMessage>({
  conversation: { 
    type: Schema.Types.ObjectId, 
    ref: 'Conversation', 
    required: true 
  },
  sender: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

// ✅ OPTIMIZED INDEXING
// ১. চ্যাট হিস্ট্রি লোড করার জন্য (conversation wise, date sorted)
messageSchema.index({ conversation: 1, createdAt: 1 });

// ২. অপঠিত মেসেজ দ্রুত খোঁজার জন্য (receiver wise + status)
messageSchema.index({ receiver: 1, isRead: 1 });

// ৩. নির্দিষ্ট sender এবং receiver এর মেসেজ খোঁজার জন্য (অপশনাল কিন্তু উপকারী)
messageSchema.index({ sender: 1, receiver: 1 });

export const Message = models.Message || model<IMessage>('Message', messageSchema);