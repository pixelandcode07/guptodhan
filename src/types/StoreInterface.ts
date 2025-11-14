export interface StoreInterface {
  storeSocialLinks: {
    facebook: string | null;
    whatsapp: string | null;
    linkedIn: string | null;
    tiktok: string | null;
    twitter: string | null;
    instagram: string | null;
  };
  commission: number;
  _id: string;
  storeId: string;
  storeLogo: string;
  storeBanner: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  vendorShortDescription: string;
  fullDescription: string; // HTML string
  storeMetaTitle: string;
  storeMetaKeywords: string[];
  status: "active" | "inactive" | "pending"; // you can narrow this to "active" | "inactive" if needed
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
}
