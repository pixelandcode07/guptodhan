

export interface CategoryDataType {
  _id: string;
  name: string;
  icon?: string;
  status: 'active' | 'inactive';
  adCount?: number;
}

export interface BuyandSellApiResponse {
  success: boolean;
  message: string;
  data: CategoryDataType[];
}


