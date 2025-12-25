// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\message\message.model.ts
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

// Index for faster queries
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });

export const Message = models.Message || model<IMessage>('Message', messageSchema);