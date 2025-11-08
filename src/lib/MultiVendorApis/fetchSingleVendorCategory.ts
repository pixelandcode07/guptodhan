// src/lib/MultiVendorApis/fetchSingleVendorCategory.ts

import axios from 'axios';

export async function fetchSingleVendorCategory(id: string, token: string) {
  if (!id) throw new Error("Category ID is required");
  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) throw new Error("API URL not configured");

  const res = await axios.get(`${baseUrl}/api/v1/vendor-category/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-store',
    },
  });

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to fetch category");
  }

  return res.data.data;
}