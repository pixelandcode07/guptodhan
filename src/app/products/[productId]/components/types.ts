export interface Review {
  _id: string;
  reviewId: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  uploadedTime: string;
  rating: number;
  comment: string;
  userImage: string;
  reviewImages?: string[]; 
}

export interface QA {
  _id: string;
  question: string;
  answer?: {
    answerText: string;
    answeredByName: string;
    answeredByEmail: string;
  };
  status: string;
  createdAt: string;
}

export type EntityRef<T extends object = Record<string, unknown>> =
  | string
  | (T & { _id?: string; id?: string; name?: string; storeName?: string; storeLogo?: string })
  | null
  | undefined;

export interface Product {
  _id: string;
  productTitle: string;
  shortDescription: string;
  fullDescription: string;
  specification: string;
  warrantyPolicy: string;
  photoGallery: string[];
  thumbnailImage: string;
  productPrice: number;
  discountPrice?: number;
  stock?: number;
  status: 'active' | 'inactive';
  vendorStoreId?: EntityRef<{ storeName?: string; storeLogo?: string }>;
  category?: EntityRef<{ name?: string }>;
  brand?: EntityRef<{ name?: string }>;
  createdAt: string;
  productOptions?: Array<{
    productImage?: string;
    color?: string;
    size?: string;
  }>;
  reviews?: Review[];
  qna?: QA[];
}

export interface ProductData {
  product: Product;
  relatedData: {
    categories: Array<{ _id: string; name: string }>;
    stores: Array<{
      _id: string;
      storeName: string;
      storeLogo?: string;
    }>;
    brands?: Array<{ _id: string; name: string }>;
    variantOptions?: {
      colors?: Array<{ _id: string; name?: string; colorName?: string }>;
      sizes?: Array<{ _id: string; name?: string; sizeName?: string }>;
    };
  };
  relatedProducts?: Array<{
    _id: string;
    productTitle: string;
    thumbnailImage: string;
    productPrice: number;
    discountPrice?: number;
    stock?: number;
    brand?: { _id: string; name: string } | string;
    category?: { _id: string; name: string } | string;
  }>;
}

export interface ProductDetailsClientProps {
  productData: ProductData;
}

