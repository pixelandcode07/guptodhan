export interface StoreData {
  _id: string;
  storeName: string;
  storeLogo: string;
  storeBanner: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  vendorShortDescription: string;
  fullDescription: string;
  commission?: number;
  storeSocialLinks?: {
    facebook?: string;
    whatsapp?: string;
    linkedIn?: string;
    tiktok?: string;
    twitter?: string;
    instagram?: string;
  };
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  productTitle: string;
  thumbnailImage: string;
  productPrice: number;
  discountPrice?: number;
  stock?: number;
  status: 'active' | 'inactive';
  brand?: { _id: string; name: string } | string;
  category?: { _id: string; name: string } | string;
}

export interface StoreDetailsClientProps {
  storeData: StoreData;
  products?: Product[];
}

