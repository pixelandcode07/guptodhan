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
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    postedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  },
  { timestamps: true }
);

export const Job = models.Job || model<IJob>('Job', jobSchema);