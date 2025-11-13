// src/types/ProductCardType.ts

export interface Brand {
  _id: string;
  name: string;
}

export interface ProductCardType {
  _id: string;
  productTitle: string;
  thumbnailImage: string;
  productPrice: number;
  discountPrice: number;
  stock?: number;
  brand?: { name: string };
  flag?: { name: string; color?: string }; // 🟢 add this line
  offerDeadline?: string;
}
