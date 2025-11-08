
import axios from 'axios';
import { VendorCategory } from '@/types/VendorCategoryType';

export async function updateVendorCategory(
  id: string,
  data: Partial<Pick<VendorCategory, 'name' | 'slug' | 'status'>>,
  token: string
) {
  // const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_URL;
  // if (!baseUrl) throw new Error("API URL not configured");

  const res = await axios.patch(
    `/api/v1/vendor-category/${id}`,
    data,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!res.data.success) throw new Error(res.data.message);
  return res.data.data;
}