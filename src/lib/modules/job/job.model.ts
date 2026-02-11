import { Schema, model, models } from 'mongoose';
import { IJob } from './job.interface';

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    salaryRange: { type: String },
    
    // Contact Info
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    
    // 🔥 CRITICAL FIX: এখানে অবশ্যই 'User' হতে হবে (PascalCase), 'user' হলে এরর দিবে।
    // কারণ user.model.ts এ model এর নাম 'User' দেওয়া আছে।
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Indexes for performance
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ location: 1, status: 1 });
jobSchema.index({ postedBy: 1 });

export const Job = models.Job || model<IJob>('Job', jobSchema);