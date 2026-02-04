// ফাইল পাথ: src/lib/modules/conversation/conversation.model.ts
import { Schema, model, models } from 'mongoose';
import { IConversation } from './conversation.interface';

const conversationSchema = new Schema<IConversation>({
  ad: { 
    type: Schema.Types.ObjectId, 
    ref: 'ClassifiedAd', 
    required: true 
  },
  participants: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }],
  lastMessage: { 
    type: Schema.Types.ObjectId, 
    ref: 'Message' 
  },
}, { timestamps: true });

// ✅ OPTIMIZED INDEXING

// ১. ইউজারের চ্যাট লিস্ট দ্রুত লোড করার জন্য (participants wise, sorted by update time)
conversationSchema.index({ participants: 1, updatedAt: -1 });

// ২. ডুপ্লিকেট চ্যাট আটকাতে এবং অ্যাড ভিত্তিক চ্যাট দ্রুত খুঁজতে
conversationSchema.index({ ad: 1, participants: 1 });

export const Conversation = models.Conversation || model<IConversation>('Conversation', conversationSchema);