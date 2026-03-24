import { Schema, model, models, Document } from 'mongoose';

export interface IAccountDeletion extends Document {
  identifier: string;
  reason?: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const accountDeletionSchema = new Schema<IAccountDeletion>(
  {
    identifier: { 
      type: String, 
      required: true 
    },
    reason: { 
      type: String, 
      default: '' 
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'rejected'], 
      default: 'pending' 
    },
  },
  { timestamps: true }
);

export const AccountDeletion = models.AccountDeletion || model<IAccountDeletion>('AccountDeletion', accountDeletionSchema);