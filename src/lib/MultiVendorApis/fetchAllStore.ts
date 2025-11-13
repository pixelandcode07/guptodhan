// lib/fetchAllStore.ts
import axios from 'axios';

export interface StoreResponse {
  _id: string;
  storeId: string;
  storeLogo: string;
  storeName: string;
  storeAddress: string;
  storeEmail: string;
  status: string;
  createdAt: string;
  commission: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: StoreResponse[];
}

const api = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
  timeout: 10000,
});

export const fetchAllStores = async (): Promise<StoreResponse[]> => {
  try {
    const response = await api.get<ApiResponse>('/api/v1/vendor-store');
    return response.data.data;
  } catch (error: any) {
    console.error('Axios Error: Failed to fetch stores', error.message || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch stores');
  }
};