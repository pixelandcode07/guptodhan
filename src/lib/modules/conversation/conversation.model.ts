  import { Schema, model, models } from 'mongoose';
  import { IConversation } from './conversation.interface';

  const conversationSchema = new Schema<IConversation>({
    ad: { type: Schema.Types.ObjectId, ref: 'ClassifiedAd', required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  }, { timestamps: true });

  export const Conversation = models.Conversation || model<IConversation>('Conversation', conversationSchema);