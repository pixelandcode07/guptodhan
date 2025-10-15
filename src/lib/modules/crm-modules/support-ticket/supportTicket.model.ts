import { Schema, model, models } from 'mongoose';
import { ISupportTicket } from './supportTicket.interface';
import { v4 as uuidv4 } from 'uuid';

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketNo: {
      type: String,
      default: () => `ST-${uuidv4().slice(0, 8)}`,
      unique: true,
    },
    customer: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
    },
    status: {
      type: String,
      enum: ['on hold', 'reject', 'resolved', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const SupportTicket =
  models.SupportTicket || model<ISupportTicket>('SupportTicket', supportTicketSchema);
