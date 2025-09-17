import { Schema, model, models } from 'mongoose';
import { ITestimonial } from './testimonial.interface';

const testimonialSchema = new Schema<ITestimonial>(
  {
    reviewID: { type: String, required: true, unique: true },
    customerImage: { type: String, required: true },
    customerName: { type: String, required: true, trim: true },
    customerProfession: { type: String, trim: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    date: { type: Date, default: Date.now },
    productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

export const TestimonialModel =
  models.TestimonialModel || model<ITestimonial>('TestimonialModel', testimonialSchema);
