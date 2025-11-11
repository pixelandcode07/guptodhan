import { Schema, model, models } from 'mongoose';
import { ISupportTicket, ISupportTicketConversation } from './supportTicket.interface';
import { v4 as uuidv4 } from 'uuid';
import '@/lib/modules/user/user.model'; // Ensure User model is registered

const ConversationSchema = new Schema<ISupportTicketConversation>({
  sender: { type: String, enum: ['user', 'admin'], required: true },
  message: { type: String, required: true },
  attachment: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketNo: {
      type: String,
      default: () => `TKT-${uuidv4().slice(0, 8).toUpperCase()}`,
      unique: true,
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User', // ✅ Linked to the User model
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: { // ✅ Added initial message
      type: String,
      required: true,
    },
    attachment: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Solved', 'Rejected', 'On Hold'],
      default: 'Pending',
    },
    conversation: [ConversationSchema], // ✅ Added conversation array
  },
  { timestamps: { createdAt: true, updatedAt: true } } // Use both timestamps
);

export const SupportTicket =
  models.SupportTicket || model<ISupportTicket>('SupportTicket', supportTicketSchema);