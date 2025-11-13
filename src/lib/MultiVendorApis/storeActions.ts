// src/lib/MultiVendorApis/storeActions.ts

import axios, { AxiosError } from "axios";

export async function fetchStoreById(id: string, token: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL!;
    const response = await axios.get(`${baseUrl}/api/v1/vendor-store/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }

    console.warn("Invalid store response", response.data);
    return null;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetch store failed:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
}
