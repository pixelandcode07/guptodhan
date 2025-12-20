import { Document, Types } from 'mongoose';

export interface IProductOption {
  productImage?: string;

  // changed to array
  unit?: string[];
  simType?: string[];
  condition?: string[];
  warranty: string,

  stock?: number;
  price?: number;
  discountPrice?: number;

  // changed to array
  color?: string[];
  size?: string[];
}

export interface IVendorProduct {
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
  thumbnailImage?: string;
  productPrice?: number;
  discountPrice?: number;
  stock?: number;
  deliveryCharge?: number;
  sku?: string;
  rewardPoints?: number;
  category: Types.ObjectId | { _id: Types.ObjectId; categoryName: string };
  subCategory?: Types.ObjectId;
  childCategory?: Types.ObjectId;
  brand?: Types.ObjectId | { _id: Types.ObjectId; brandName: string };
  productModel?: Types.ObjectId | { _id: Types.ObjectId; modelName: string };
  flag?: Types.ObjectId | { _id: Types.ObjectId; flagName: string };
  warranty?: Types.ObjectId | { _id: Types.ObjectId; warrantyName: string };
  weightUnit?: Types.ObjectId | { _id: Types.ObjectId; unitName: string };
  offerDeadline?: Date;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  status: 'active' | 'inactive';
  sellCount?: number;
  productOptions?: IProductOption[];
  createdAt?: Date;
  updatedAt?: Date;
}