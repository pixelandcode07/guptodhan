import { Document, Types } from "mongoose";

export interface IStore extends Document {
  // storeId: string;
  vendorId: Types.ObjectId;
  storeLogo: string;
  storeBanner: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  vendorShortDescription: string;
  fullDescription: string;
  commission: number;
  availableBalance: number;
  totalEarned: number;    
  totalWithdrawn: number;
  paymentInfo?: {
    bkash?: string;
    nagad?: string;
    rocket?: string;
    bankName?: string;
    bankAccount?: string;
    bankBranch?: string;
  };
  storeSocialLinks: {
    facebook?: string;
    whatsapp?: string;
    linkedIn?: string;
    tiktok?: string;
    twitter?: string;
    instagram?: string;
  };
  storeMetaTitle: string;
  storeMetaKeywords: string[];
  storeMetaDescription: string;
  status: "active" | "inactive";
  createdAt: Date;
}
