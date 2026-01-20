import { Schema, model, models } from 'mongoose';
import { IChildCategory } from '../interfaces/ecomChildCategory.interface';
import './ecomCategory.model';
import './ecomSubCategory.model';

const childCategorySchema = new Schema<IChildCategory>(
  {
    childCategoryId: { 
      type: String, 
      required: true, 
      unique: true // ✅ Auto index
    },
    category: { 
      type: Schema.Types.ObjectId, 
      ref: 'CategoryModel', 
      required: true 
    },
    subCategory: { 
      type: Schema.Types.ObjectId, 
      ref: 'SubCategoryModel', 
      required: true 
    },
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    icon: { 
      type: String 
    }, 
    slug: { 
      type: String, 
      required: true, 
      unique: true // ✅ Auto index
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active' 
    },
  },
  { 
    timestamps: { 
      createdAt: true, 
      updatedAt: false 
    } 
  }
);

// ================================================================
// 🎯 INDEXES - Professional Strategy
// ================================================================

// ✅ Single Field Indexes
childCategorySchema.index({ status: 1 });
childCategorySchema.index({ createdAt: -1 });

// ✅ Compound Indexes (ESR rule: Equality, Sort, Range)

// Most common: Get active child categories by subcategory
childCategorySchema.index({ 
  subCategory: 1,    // Equality (parent subcategory)
  status: 1,         // Equality (active)
  createdAt: -1      // Sort (recent first)
});

// Query: Get child categories by main category
childCategorySchema.index({ 
  category: 1,       // Equality (parent category)
  status: 1,         // Equality
  createdAt: -1      // Sort
});

// Query: Get all child categories under category + subcategory
childCategorySchema.index({ 
  category: 1,       // Equality
  subCategory: 1,    // Equality
  status: 1          // Equality
});

// Query: Search by name within subcategory
childCategorySchema.index({ 
  subCategory: 1,    // Equality
  status: 1,         // Equality
  name: 1            // For search
});

// ✅ Text Search Index
childCategorySchema.index({ 
  name: 'text' 
});

export const ChildCategoryModel =
  models.ChildCategoryModel || model<IChildCategory>('ChildCategoryModel', childCategorySchema);