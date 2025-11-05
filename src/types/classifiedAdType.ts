export interface ClassifiedAdType {
  title: string;
  user?: string;
  category: string;
  subCategory?: string;
  division: string;
  district: string;
  upazila: string;
  condition: 'new' | 'used';
  authenticity: 'original' | 'refurbished';
  brand?: { label: string; value: string } | null;
  productModel?: { label: string; value: string } | null;
  edition?: { label: string; value: string } | null;
  features?: string[];
  description: string;
  price: number;
  isNegotiable: boolean;
  images: (File | string)[];
  contactDetails: {
    name: string;
    email?: string;
    phone: string;
    isPhoneHidden: boolean;
  };
  status?: 'active' | 'sold' | 'inactive';
}

export interface CategoryData {
  _id: string;
  name: string;
  adCount: number;
  parentPath: string[];
  icon?: string;
  status?: 'active' | 'inactive';
}
