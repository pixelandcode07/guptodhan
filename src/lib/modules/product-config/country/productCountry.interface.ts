// src/lib/modules/product-config/interfaces/productCountry.interface.ts

export interface IProductCountry {
  _id?: string;
  name: string;           // e.g. "Bangladesh"
  code?: string;          // e.g. "BD" (ISO 3166-1 alpha-2)
  flag?: string;          // optional emoji or image url e.g. "🇧🇩"
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}