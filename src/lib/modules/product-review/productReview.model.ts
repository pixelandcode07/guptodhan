import { Schema, model, models } from 'mongoose';
import { IReview } from './productReview.interface';

const reviewSchema = new Schema<IReview>(
  {
    reviewId: { 
      type: String, 
      required: true, 
      unique: true // ✅ Auto index
    },
    productId: { 
      type: Schema.Types.ObjectId, 
      ref: 'VendorProductModel', 
      required: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    userName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    userEmail: { 
      type: String, 
      required: true, 
      trim: true 
    },
    uploadedTime: { 
      type: Date, 
      default: Date.now 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    comment: { 
      type: String, 
      trim: true 
    },
    userImage: { 
      type: String, 
      required: true 
    },
    reviewImages: {
      type: [String],   
      default: [],     
      required: false,  
    },
  },
  { timestamps: true }
);

// ================================================================
// 🎯 INDEXES - Professional Strategy
// ================================================================

// ✅ Single Field Indexes
reviewSchema.index({ rating: -1 }); // For filtering by rating
reviewSchema.index({ uploadedTime: -1 }); // For sorting
reviewSchema.index({ createdAt: -1 }); // For recent reviews

// ✅ Compound Indexes (ESR rule: Equality, Sort, Range)

// Most common: Get product reviews sorted by date
reviewSchema.index({ 
  productId: 1,        // Equality (product)
  uploadedTime: -1     // Sort (recent first)
});

// Query: Get user's reviews
reviewSchema.index({ 
  userId: 1,           // Equality (user)
  uploadedTime: -1     // Sort
});

// Query: Get product reviews filtered by rating
reviewSchema.index({ 
  productId: 1,        // Equality
  rating: -1,          // Sort/Filter (high to low)
  uploadedTime: -1     // Sort
});

// Query: Get user's reviews by rating
reviewSchema.index({ 
  userId: 1,           // Equality
  rating: -1,          // Filter
  uploadedTime: -1     // Sort
});

// ✅ Text Search Index (for searching review comments)
reviewSchema.index({ 
  comment: 'text',
  userName: 'text'
});

// ================================================================
// 🎯 PERFORMANCE NOTES
// ================================================================
/*
Indexes Created:
1. reviewId (unique) - Auto
2. rating - Single (desc)
3. uploadedTime - Single (desc)
4. createdAt - Single (desc)
5. { productId, uploadedTime } - Compound (most queries)
6. { userId, uploadedTime } - Compound (user reviews)
7. { productId, rating, uploadedTime } - Compound (filtered)
8. { userId, rating, uploadedTime } - Compound (user filtered)
9. { comment, userName } - Text search

Total: 9 indexes

Expected Performance:
- Get product reviews: O(log n) with index
- Get user reviews: O(log n) with index
- Filter by rating: O(1) with compound index
- Text search: O(log n) with text index
*/

export const ReviewModel =
  models.ReviewModel || model<IReview>('ReviewModel', reviewSchema);