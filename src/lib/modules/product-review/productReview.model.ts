import { Schema, model, models } from 'mongoose';
import { IReview } from './productReview.interface';

const reviewSchema = new Schema<IReview>(
  {
    reviewId: { type: String, required: true, unique: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    uploadedTime: { type: Date, default: Date.now },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    userImage: { type: String, required: true },

    // image upload
    reviewImages: {
      type: [String],   
      default: [],     
      required: false,  
    },
  },
  { timestamps: true }
);

export const ReviewModel =
  models.ReviewModel || model<IReview>('ReviewModel', reviewSchema);
