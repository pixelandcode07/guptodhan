import { Document } from 'mongoose';

export interface ISupportTicket extends Document {
  ticketNo: string;
  customer: string;
  subject: string;
  attachment?: string;
  status: 'on hold' | 'reject' | 'resolved' | 'pending';
  createdAt: Date;
}
