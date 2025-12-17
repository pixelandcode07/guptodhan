// src/lib/models-index.ts
// ================================================================
// 🔥 CRITICAL: Import all models FIRST to register them
// ================================================================
import '@/lib/modules/ecommerce-category/models/ecomCategory.model';
import '@/lib/modules/ecommerce-category/models/ecomSubCategory.model';
import '@/lib/modules/ecommerce-category/models/ecomChildCategory.model';
import '@/lib/modules/brand/brand.model';
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
// Export models safely (avoid re-registration)
// ================================================================
import mongoose from 'mongoose';

// Helper function to safely get models
const getModel = (modelName: string) => {
  if (!mongoose.models[modelName]) {
    throw new Error(`Model ${modelName} is not registered. Check your model file.`);
  }
  return mongoose.models[modelName];
};

export const CategoryModel = getModel('EcomCategory');
export const SubCategoryModel = getModel('EcomSubCategory');
export const ChildCategoryModel = getModel('EcomChildCategory');
export const BrandModel = getModel('BrandModel');
export const ProductModelModel = getModel('ProductModel');
export const ProductFlagModel = getModel('ProductFlag');
export const WarrantyModel = getModel('Warranty');
export const ProductUnitModel = getModel('ProductUnit');
export const VendorProductModel = getModel('VendorProduct');
export const ProductReviewModel = getModel('ProductReview');
export const VendorStoreModel = getModel('VendorStore');
export const VendorModel = getModel('Vendor');
export const IntegrationsModel = getModel('Integrations');
export const UserModel = getModel('User');
export const OrderModel = getModel('Order');

// Export a constant to confirm models are loaded
export const MODELS_LOADED = true;