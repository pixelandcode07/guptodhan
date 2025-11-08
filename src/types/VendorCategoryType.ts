
export interface VendorCategory {
  _id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}