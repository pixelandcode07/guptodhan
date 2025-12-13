
import axios from 'axios';
import { VendorCategory } from '@/types/VendorCategoryType';

export async function updateVendorCategory(
  id: string,
  data: Partial<Pick<VendorCategory, 'name' | 'slug' | 'status'>>,
  token: string
) {

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