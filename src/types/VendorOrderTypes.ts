// src/types/VendorOrderTypes.ts

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
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserId {
  _id: string;
  name: string;
  email: string;
}

export interface OrderDetail {
  _id: string;
  orderDetailsId: string;
  orderId: string;
  productId: string;
  vendorId: string;
  quantity: number;
  unitPrice: number;
  discountPrice: number;
  totalPrice: number;
  size: string;
  color: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorOrder {
  _id: string;
  orderId: string;
  userId: UserId;
  storeId: string;
  deliveryMethodId: string;
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
  shippingStreetAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingPostalCode: string;
  shippingCountry: string;
  addressDetails: string;
  deliveryCharge: number;
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus:
    | 'Pending'
    | 'Confirmed'
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled';
  orderForm: string;
  orderDate: string;
  deliveryDate: string;
  orderDetails: OrderDetail[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  transactionId?: string;
}

export interface VendorOrdersApiResponse {
  success: boolean;
  message: string;
  data: {
    store: Store;
    orders: VendorOrder[];
  };
}