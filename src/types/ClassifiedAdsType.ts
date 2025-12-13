export interface ClassifiedAdsType {
  contactDetails: {
    name: string;
    email: string;
    phone: string;
    isPhoneHidden: boolean;
  };
  _id: string;
  title: string;
  user: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  category: {
    _id: string;
    name: string;
  };
  subCategory: {
    _id: string;
    name: string;
  };
  division: string;
  district: string;
  upazila: string;
  condition: string;
  authenticity: string;
  brand: string;
  productModel: string;
  edition: string;
  features: string[];
  description: string;
  price: number;
  isNegotiable: boolean;
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}



// types/ClassifiedAdType.ts
export type ClassifiedAdListing = {
  _id: string;
  title: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  category: {
    _id: string;
    name: string;
  };
  subCategory?: {
    _id: string;
    name: string;
  };
  division: string;
  district: string;
  upazila: string;
  condition: 'new' | 'used';
  authenticity: string;
  brand?: string;
  productModel?: string;
  edition?: string;
  features?: string[];
  description: string;
  price: number;
  isNegotiable: boolean;
  images: string[];
  contactDetails: {
    name: string;
    email?: string;
    phone: string;
    isPhoneHidden: boolean;
  };
  status: 'pending' | 'active' | 'inactive' | 'sold';
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
