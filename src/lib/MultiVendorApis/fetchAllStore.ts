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

  if (!baseUrl) {
    console.error('API base URL is not configured');
    return [];
  }
  try {
    const response = await axios.get<ApiResponse>(`${baseUrl}/api/v1/public/vendor-store`);
    return response.data.data;
  } catch (error: any) {
    console.error('Axios Error: Failed to fetch stores', error.message || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch stores');
  }
};