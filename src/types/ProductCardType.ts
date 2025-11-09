// src/types/ProductCardType.ts

export interface Brand {
  _id: string;
  name: string;
}

export interface ProductCardType {
  _id: string;
  productTitle: string;
  thumbnailImage: string;     // guaranteed URL
  productPrice: number;
  discountPrice: number;
  stock: number;
  offerDeadline?: string;     // ISO string
  brand?: Brand;
}