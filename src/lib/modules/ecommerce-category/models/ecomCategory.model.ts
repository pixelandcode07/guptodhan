import { Schema, model, models } from 'mongoose';
import { ICategory } from '../interfaces/ecomCategory.interface';
import { v4 as uuidv4 } from 'uuid';

const categorySchema = new Schema<ICategory>(
  {
    categoryId: { 
      type: String, 
      required: true, 
      unique: true, // ✅ This creates index automatically
      default: () => `CATID-${uuidv4().split('-')[0]}` 
    },
    name: { 
      type: String, 
      required: true, 
      trim: true 
      // ❌ NO index here - will add compound index below
    },
    categoryIcon: { 
      type: String, 
      required: true 
    },
    categoryBanner: { 
      type: String 
    },
    isFeatured: { 
      type: Boolean, 
      default: false 
      // ❌ NO index here - will add compound index below
    },
    isNavbar: { 
      type: Boolean, 
      default: false 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true // ✅ This creates index automatically
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active' 
      // ❌ NO index here - will add compound index below
    },
    orderCount: { 
      type: Number, 
      required: false, 
      default: 0 
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

// ✅ Single Field Indexes (for specific lookups)
// categoryId and slug already have unique indexes from schema

categorySchema.index({ status: 1 }); // For filtering active/inactive categories
categorySchema.index({ isFeatured: 1 }); // For featured category queries
categorySchema.index({ isNavbar: 1 }); // For navbar category queries
categorySchema.index({ orderCount: -1 }); // For popular categories (sorting)
categorySchema.index({ createdAt: -1 }); // For recent categories

// ✅ Compound Indexes (ESR rule: Equality, Sort, Range)

// Most common query: Get active featured categories sorted by orderCount
categorySchema.index({ 
  status: 1,           // Equality (status = 'active')
  isFeatured: 1,       // Equality (isFeatured = true)
  orderCount: -1       // Sort (descending)
});

// Query: Get active navbar categories
categorySchema.index({ 
  status: 1,           // Equality
  isNavbar: 1,         // Equality
  orderCount: -1       // Sort
});

// Query: Get categories by name (for admin search)
categorySchema.index({ 
  status: 1,           // Equality
  name: 1              // For text-like searches
});

// ✅ Text Search Index (for category search functionality)
categorySchema.index({ 
  name: 'text',        // Full-text search on name
});

// ================================================================
// 🎯 PERFORMANCE NOTES
// ================================================================
/*
Indexes Created:
1. categoryId (unique) - Auto from schema
2. slug (unique) - Auto from schema
3. status - Single field
4. isFeatured - Single field
5. isNavbar - Single field
6. orderCount - Single field (descending)
7. createdAt - Single field (descending)
8. { status, isFeatured, orderCount } - Compound (most queries)
9. { status, isNavbar, orderCount } - Compound (navbar queries)
10. { status, name } - Compound (search queries)
11. { name } - Text search

Total: 11 indexes

Expected Performance:
- Get featured categories: O(1) with index
- Get navbar categories: O(1) with index
- Search by name: O(log n) with text index
- Get by slug: O(1) with unique index
*/

export const CategoryModel =
  models.CategoryModel || model<ICategory>('CategoryModel', categorySchema);