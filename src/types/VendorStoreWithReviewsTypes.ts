export interface StoreSocialLinks {
  facebook: string;
  whatsapp: string;
  instagram: string;
  linkedIn: string;
  twitter: string;
  tiktok: string;
}

export interface Store {
  storeSocialLinks: StoreSocialLinks;
  _id: string;
  vendorId: string;
  storeLogo: string;
  storeBanner: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  vendorShortDescription: string;
  fullDescription: string;
  commission: number;
  storeMetaTitle: string;
  storeMetaKeywords: string[];
  storeMetaDescription: string;
  status: 'active' | 'inactive'; // assuming common statuses, adjust if needed
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductOption {
  productImage: string;
  unit: string[]; // empty in example, but array
  simType: string[]; // empty in example
  condition: string[];
  warranty: string;
  stock: number;
  price: number;
  discountPrice: number;
  color: string[];
  size: string[];
}

export interface ReviewImage {
  // Just a string URL in the data
}

export interface Review {
  _id: string;
  reviewId: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  uploadedTime: string;
  rating: number; // 1-5
  comment: string;
  userImage: string;
  reviewImages: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
  _id: string;
  productId: string;
  productTitle: string;
  vendorStoreId: string;
  vendorName: string;
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
  category: string;
  brand: string;
  productModel: string;
  flag: string;
  warranty: string;
  weightUnit: string;
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  status: 'active' | 'inactive';
  sellCount: number;
  productOptions: ProductOption[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

export interface Data {
  store: Store;
  products: Product[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Data;
}