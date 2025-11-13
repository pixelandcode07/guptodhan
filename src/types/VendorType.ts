export type VendorStatus = 'pending' | 'approved' | 'rejected';

export interface VendorUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface Vendor {
  _id: string;
  status: VendorStatus;
  user: VendorUser;
  businessName: string;
  businessCategory: string;
  tradeLicenseNumber: string;
  businessAddress: string;
  ownerName: string;
  ownerNidUrl: string;
  tradeLicenseUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}