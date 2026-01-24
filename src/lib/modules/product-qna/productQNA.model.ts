import { Schema, model, models } from 'mongoose';
import { IProductQA } from './productQNA.interface';

const productQASchema = new Schema<IProductQA>(
  {
    qaId: { 
      type: String, 
      required: true, 
      unique: true // ✅ Auto index
    },
    productId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Product', 
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
    userImage: { 
      type: String 
    },
    question: { 
      type: String, 
      required: true, 
      trim: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active' 
    },
    answer: {
      answeredByName: { type: String, trim: true },
      answeredByEmail: { type: String, trim: true },
      answerText: { type: String, trim: true },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

// ================================================================
// 🎯 INDEXES - Professional Strategy
// ================================================================

// ✅ Single Field Indexes
productQASchema.index({ status: 1 });
productQASchema.index({ createdAt: -1 });

// ✅ Compound Indexes (ESR rule: Equality, Sort, Range)

// Most common: Get Q&A by product (active, sorted by date)
productQASchema.index({ 
  productId: 1,        // Equality (product)
  status: 1,           // Equality (active)
  createdAt: -1        // Sort (recent first)
});

// Query: Get user's questions
productQASchema.index({ 
  userId: 1,           // Equality (user)
  status: 1,           // Equality
  createdAt: -1        // Sort
});

// Query: Get answered/unanswered questions
productQASchema.index({ 
  status: 1,           // Equality
  'answer.answerText': 1,  // Check if answered
  createdAt: -1        // Sort
});

// ✅ Text Search Index (for searching questions)
productQASchema.index({ 
  question: 'text',
  'answer.answerText': 'text'
});

// ================================================================
// 🎯 PERFORMANCE NOTES
// ================================================================
/*
Indexes Created:
1. qaId (unique) - Auto
2. status - Single
3. createdAt - Single (desc)
4. { productId, status, createdAt } - Compound (most queries)
5. { userId, status, createdAt } - Compound (user queries)
6. { status, answer.answerText, createdAt } - Compound (answered filter)
7. { question, answer.answerText } - Text search

Total: 7 indexes
*/

export const ProductQAModel =
  models.ProductQAModel || model<IProductQA>('ProductQAModel', productQASchema);