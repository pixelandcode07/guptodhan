
import axios from 'axios';

export async function deleteVendorCategory(id: string, token?: string) {
  // const baseUrl = process.env.NEXTAUTH_URL;
  // if (!baseUrl) throw new Error("API URL not configured");

  const headers: Record<string, string> = {
    'Cache-Control': 'no-store',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await axios.delete(`/api/v1/vendor-category/${id}`, { headers });
  if (!res.data.success) throw new Error(res.data.message);
}
