import { Document, Types } from 'mongoose';

export interface IVendorProduct extends Document {
  productId: string;
  productTitle: string;
  shortDescription: string;
  fullDescription: string;
  specification: string;
  warrantyPolicy: string;
  productTag?: string[];
  videoUrl?: string;
  photoGallery: string[];
  thumbnailImage: string;
  productPrice: number;
  discountPrice?: number;
  stock?: number;
  sku?: string;
  rewardPoints?: number;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  childCategory?: Types.ObjectId;
  brand?: Types.ObjectId;
  productModel?: string;
  flag?: string;
  warranty: string;
  weightUnit?: string;
  offerDeadline?: Date;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}


//  Vendor Prudct add
//  productID
//  Product Title
//  Short Description - 255 ch
//  full Description 
// Speicfication
//  Warranty policy
//  Product Tag - optional
//  Video Url - optional
//  photo gallery
//  thumbnail image
//  Product price - regular
//  Discount Price - optional 
// stock - optional 
// sku - product code - optional 
// reword points - optional  
// category
//  sub category - optional 
// child category - optional 
// Brand - optional 
// model - optional 
// flag - optional 
// warranty
//  weight/unit - optional 
// offer deadline - optional 
// meta title - optional 
// meta keyword - optional 
// meta description - optional 