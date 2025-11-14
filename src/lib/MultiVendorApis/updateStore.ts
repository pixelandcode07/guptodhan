
import { StoreInterface } from '@/types/StoreInterface';
import axios from 'axios';

export async function updateStore(
  id: string,
  data: StoreInterface,
) {
  const res = await axios.patch(`/api/v1/vendor-store/${id}`, data);

  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to update store');
  }

  return res.data.data;
}