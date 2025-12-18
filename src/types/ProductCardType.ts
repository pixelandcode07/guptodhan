interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Flag {
  _id: string;
  name: string;
}

interface Warranty {
  _id: string;
  warrantyName: string;
}

interface WeightUnit {
  _id: string;
  name: string;
}

interface ProductOption {
  productImage: string;
  unit: string[]; // assuming IDs or empty array
  simType: string[]; // IDs
  condition: string[]; // IDs
  warranty: string; // ID
  stock: number;
  price: number;
  discountPrice: number;
  color: string[]; // IDs
  size: string[]; // IDs
}

interface ReviewImage {
  // reviewImages is an array of strings (URLs)
}

interface Review {
  _id: string;
  reviewId: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  uploadedTime: string; // ISO date string
  rating: number;
  comment: string;
  userImage: string;
  reviewImages: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductCardType {
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
  category: Category;
  brand: Brand;
  productModel: string | null;
  flag: Flag;
  warranty: Warranty;
  weightUnit: WeightUnit;
  offerDeadline: string; // ISO date string
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  status: string;
  sellCount: number;
  productOptions: ProductOption[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}
