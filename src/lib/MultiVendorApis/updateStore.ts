// lib/MultiVendorApis/updateStore.ts
import axios from 'axios';

export interface UpdateStoreData {
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
  vendorShortDescription?: string;
  fullDescription?: string;
  commission?: number;
  storeSocialLinks?: {
    facebook?: string | null;
    whatsapp?: string | null;
    instagram?: string | null;
    linkedIn?: string | null;
    twitter?: string | null;
    tiktok?: string | null;
  };
  status?: "active" | "inactive";
}

export async function updateStore(
  id: string,
  data: UpdateStoreData,
  token: string
) {
  const res = await axios.patch(
    `/api/v1/vendor-store/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to update store');
  }

  return res.data.data;
}