import { StoreInterface } from '@/types/StoreInterface';
import axios from 'axios';

export interface ApiResponse {
  success: boolean;
  message: string;
  data: StoreInterface[];
}


export const fetchAllStores = async (): Promise<StoreInterface[]> => {
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!baseUrl) {
    console.error('API base URL is not configured');
    return [];
  }
  try {
    const response = await axios.get<ApiResponse>(`${baseUrl}/api/v1/vendor-store`);
    return response.data.data;
  } catch (error: any) {
    console.error('Axios Error: Failed to fetch stores', error.message || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch stores');
  }
};



export const fetchAllPublicStores = async (): Promise<StoreInterface[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log("📡 [fetchAllPublicStores] Starting...");
  console.log("📡 [fetchAllPublicStores] Base URL:", baseUrl);

  if (!baseUrl) {
    console.error("❌ API base URL is not configured");
    return [];
  }

  try {
    console.log("📡 [fetchAllPublicStores] Making request to:", `${baseUrl}/api/v1/public/vendor-store`);
    
    const response = await axios.get<ApiResponse>(
      `${baseUrl}/api/v1/public/vendor-store`,
      {
        timeout: 15000,
        headers: { 'Cache-Control': 'no-cache' },
      }
    );

    console.log("📡 [fetchAllPublicStores] Response status:", response.status);
    console.log("📡 [fetchAllPublicStores] Response data type:", typeof response.data);
    console.log("📡 [fetchAllPublicStores] Response data:", response.data);
    console.log("📡 [fetchAllPublicStores] Response.data.data type:", typeof response.data.data);
    console.log("📡 [fetchAllPublicStores] Response.data.data is Array?:", Array.isArray(response.data.data));

    if (!response.data?.success) {
      console.warn("⚠️ API returned success: false");
      return [];
    }

    if (!Array.isArray(response.data.data)) {
      console.warn("⚠️ response.data.data is not an array:", response.data.data);
      return [];
    }

    console.log("✅ [fetchAllPublicStores] Success! Returned", response.data.data.length, "stores");
    return response.data.data;
  } catch (error: any) {
    console.error("❌ [fetchAllPublicStores] Error caught:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error response status:", error.response?.status);
    console.error("Error response data:", error.response?.data);
    console.error("Full error:", error);
    return [];
  }
};