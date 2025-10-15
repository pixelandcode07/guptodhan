import { Schema, model, models } from 'mongoose';
import { IContactRequest } from './contactReq.interface';

const contactRequestSchema = new Schema<IContactRequest>(
  {
    userName: { type: String, required: true },
    userEmail: { type: String },
    userNumber: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ContactRequest =
  models.ContactRequest || model<IContactRequest>('ContactRequest', contactRequestSchema);
