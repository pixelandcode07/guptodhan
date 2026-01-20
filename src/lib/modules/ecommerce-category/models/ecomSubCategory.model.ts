import { Schema, model, models } from 'mongoose';
import { ISubCategory } from '../interfaces/ecomSubCategory.interface';
import './ecomCategory.model'; // Import to ensure CategoryModel is registered

const subCategorySchema = new Schema<ISubCategory>(
  {
    subCategoryId: { 
      type: String, 
      required: true, 
      unique: true // ✅ Auto index
    },
    category: { 
      type: Schema.Types.ObjectId, 
      ref: 'CategoryModel', 
      required: true 
    },
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    subCategoryIcon: { 
      type: String 
    },
    subCategoryBanner: { 
      type: String 
    },
    isFeatured: { 
      type: Boolean, 
      default: false 
    },
    isNavbar: { 
      type: Boolean, 
      default: false 
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active' 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true // ✅ Auto index
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
subCategorySchema.index({ status: 1 });
subCategorySchema.index({ isFeatured: 1 });
subCategorySchema.index({ isNavbar: 1 });
subCategorySchema.index({ createdAt: -1 });

// ✅ Compound Indexes (ESR rule: Equality, Sort, Range)

// Most common: Get active subcategories by parent category
subCategorySchema.index({ 
  category: 1,       // Equality (parent category)
  status: 1,         // Equality (active)
  createdAt: -1      // Sort (recent first)
});

// Query: Get featured subcategories by category
subCategorySchema.index({ 
  category: 1,       // Equality
  isFeatured: 1,     // Equality
  status: 1          // Equality
});

// Query: Get navbar subcategories
subCategorySchema.index({ 
  status: 1,         // Equality
  isNavbar: 1,       // Equality
  createdAt: -1      // Sort
});

// Query: Search by name within category
subCategorySchema.index({ 
  category: 1,       // Equality
  status: 1,         // Equality
  name: 1            // For search
});

// ✅ Text Search Index
subCategorySchema.index({ 
  name: 'text' 
});

export const SubCategoryModel =
  models.SubCategoryModel || model<ISubCategory>('SubCategoryModel', subCategorySchema);