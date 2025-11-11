import { Document } from "mongoose";

export interface IStore extends Document {
  storeId: string;
  storeLogo: string;
  storeBanner: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  vendorShortDescription: string;
  fullDescription: string;
  commission: number;
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
  status: "active" | "inactive";
  createdAt: Date;
}
