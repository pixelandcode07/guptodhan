// src/types/ProductCardType.ts

export interface Brand {
  _id: string;
  name: string;
}

export interface ProductCardType {
  _id: string;
  productId: string;
  productTitle: string;
  vendorStoreId: string;
  shortDescription: string;
  fullDescription: string;
  specification: string;
  warrantyPolicy: string;
  productTag: string[];
  videoUrl: string;
  photoGallery: string[];
  thumbnailImage: string;
  productPrice: number;
  discountPrice: number;
  stock: number;
  sku: string;
  rewardPoints: number;
  category: {
    _id: string;
    name: string;
  };
  brand: string | null;
  flag: {
    _id: string;
    name: string;
  };
  warranty: {
    _id: string;
    warrantyName: string;
  };
  weightUnit: {
    _id: string;
    name: string;
  };
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  status: "active" | "inactive";
  sellCount: number;
  productOptions: any[];
}
