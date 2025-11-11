import { Document, Types } from 'mongoose';

export interface ISupportTicketConversation {
  sender: 'user' | 'admin';
  message: string;
  attachment?: string;
  timestamp: Date;
}

export interface ISupportTicket extends Document {
  ticketNo: string;
  reporter: Types.ObjectId; 
  subject: string;
  message: string; 
  attachment?: string;
  status: 'Pending' | 'In Progress' | 'Solved' | 'Rejected' | 'On Hold';
  openDuration?: string; // For display
  conversation: ISupportTicketConversation[]; 
  createdAt: Date;
}