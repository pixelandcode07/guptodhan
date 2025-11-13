export interface Product {
  _id: string;
  productId: string;
  productTitle: string;
  shortDescription: string;
  thumbnailImage: string;
  productPrice: number;
  discountPrice: number;
  stock: number;
  sku: string;
  rewardPoints: number;
  status: string;
  sellCount: number;
  offerDeadline?: string;
  brand?: { _id: string; name: string };
  flag?: { _id: string; name: string; color?: string };
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