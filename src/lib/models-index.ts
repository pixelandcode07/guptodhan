// src/lib/models-index.ts
import mongoose from 'mongoose';

// ================================================================
// 🔥 CRITICAL: Import all models FIRST to register them
// ================================================================
import '@/lib/modules/ecommerce-category/models/ecomCategory.model';
import '@/lib/modules/ecommerce-category/models/ecomSubCategory.model';
import '@/lib/modules/ecommerce-category/models/ecomChildCategory.model';
import '@/lib/modules/product-config/models/brandName.model';
import '@/lib/modules/product-model/productModel.model';
import '@/lib/modules/product-config/models/productFlag.model';
import '@/lib/modules/product-config/models/warranty.model';
import '@/lib/modules/product-config/models/productUnit.model';
import '@/lib/modules/vendor-store/vendorStore.model';
import '@/lib/modules/product/vendorProduct.model';
import '@/lib/modules/product-review/productReview.model';
import '@/lib/modules/vendors/vendor.model';
import '@/lib/modules/integrations/integrations.model';
import '@/lib/modules/user/user.model';
import '@/lib/modules/product-order/order/order.model';

// ================================================================
// Helper function to safely get models
// ================================================================
const getModel = (modelName: string) => {
  if (!mongoose.models[modelName]) {
    throw new Error(
      `Model ${modelName} is not registered. Check your model file. Available models: ${Object.keys(mongoose.models).join(', ')}`
    );
  }
  return mongoose.models[modelName];
};

// ================================================================
// Export models using the EXACT names they are registered with
// Based on available models from error message
// ================================================================
export const CategoryModel = getModel('CategoryModel');
export const SubCategoryModel = getModel('SubCategoryModel');
export const ChildCategoryModel = getModel('ChildCategoryModel');
export const BrandModel = getModel('BrandModel');
export const ProductModelModel = getModel('ProductModel');
export const ProductFlagModel = getModel('ProductFlag');
export const WarrantyModel = getModel('ProductWarrantyModel'); // ✅ FIXED: Correct name
export const ProductUnitModel = getModel('ProductUnit');
export const VendorProductModel = getModel('VendorProductModel');
export const ProductReviewModel = getModel('ReviewModel'); // ✅ FIXED: Correct name
export const VendorStoreModel = getModel('Vendor'); // ✅ FIXED: Correct name
export const VendorModel = getModel('Vendor');
export const IntegrationsModel = getModel('Integrations');
export const UserModel = getModel('User');
export const OrderModel = getModel('Order');

// ================================================================
// Note: CartModel, WishlistModel, PromoCodeModel, SupportTicketModel
// are NOT included as they are not registered in this setup
// Only export models that are actually needed for dashboard
// ================================================================

// Export a constant to confirm models are loaded
export const MODELS_LOADED = true;