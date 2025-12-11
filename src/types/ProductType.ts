// export interface Product {
//   _id: string;
//   productId: string;
//   productTitle: string;
//   shortDescription: string;
//   thumbnailImage: string;
//   productPrice: number;
//   discountPrice: number;
//   stock: number;
//   sku: string;
//   rewardPoints: number;
//   status: string;
//   sellCount: number;
//   offerDeadline?: string;
//   brand?: { _id: string; name: string };
//   flag?: { _id: string; name: string; color?: string };
// }



export interface Product {
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

export interface LandingPageResponse {
  success: boolean;
  message: string;
  data: {
    runningOffers: Product[];
    bestSelling: Product[];
    randomProducts: Product[];
  };
}