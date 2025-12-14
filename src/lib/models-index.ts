// src/lib/models-index.ts
import mongoose from 'mongoose';

// ================================================================
// Import all models to ensure they're registered
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

// ================================================================
// Export models using mongoose.models to avoid re-registration
// ================================================================
export const CategoryModel = mongoose.models.EcomCategory || mongoose.model('EcomCategory');
export const SubCategoryModel = mongoose.models.EcomSubCategory || mongoose.model('EcomSubCategory');
export const ChildCategoryModel = mongoose.models.EcomChildCategory || mongoose.model('EcomChildCategory');

// ✅ FIXED: Brand -> BrandModel
export const BrandModel = mongoose.models.BrandModel || mongoose.model('BrandModel');

export const ProductModelModel = mongoose.models.ProductModel || mongoose.model('ProductModel');
export const ProductFlagModel = mongoose.models.ProductFlag || mongoose.model('ProductFlag');
export const WarrantyModel = mongoose.models.Warranty || mongoose.model('Warranty');
export const ProductUnitModel = mongoose.models.ProductUnit || mongoose.model('ProductUnit');
export const VendorProductModel = mongoose.models.VendorProduct || mongoose.model('VendorProduct');
export const ProductReviewModel = mongoose.models.ProductReview || mongoose.model('ProductReview');
export const VendorStoreModel = mongoose.models.VendorStore || mongoose.model('VendorStore');
export const VendorModel = mongoose.models.Vendor || mongoose.model('Vendor');
export const IntegrationsModel = mongoose.models.Integrations || mongoose.model('Integrations');