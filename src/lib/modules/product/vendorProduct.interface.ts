// File: vendorProduct.interface.ts

import { Types } from "mongoose";

export interface IProductOption {
  productImage?: string;
  
  // ✅ FIXED: Made all fields optional with ? 
  unit?: string[];
  simType?: string[];
  condition?: string[];
  warranty?: string; // ✅ Made optional
  
  stock?: number;
  price?: number;
  discountPrice?: number;
  
  color?: string[]; // ✅ Made optional
  size?: string[];  // ✅ Made optional
}

export interface IVendorProduct {
  _id?: string;
  productId: string;
  productTitle: string;
  vendorStoreId: Types.ObjectId;
  vendorName: string;
  shortDescription: string;
  fullDescription: string;
  specification?: string;
  warrantyPolicy?: string;
  productTag?: string[];
  videoUrl?: string;
  photoGallery?: string[];
  thumbnailImage: string;
  productPrice?: number;
  discountPrice?: number;
  stock?: number;
  sku?: string;
  rewardPoints?: number;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  childCategory?: Types.ObjectId;
  brand?: Types.ObjectId;
  productModel?: Types.ObjectId;
  flag?: Types.ObjectId;
  warranty?: Types.ObjectId;
  weightUnit?: Types.ObjectId;
  offerDeadline?: Date;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  status: 'active' | 'inactive';
  sellCount?: number;
  productOptions?: IProductOption[]; // ✅ Made optional
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}