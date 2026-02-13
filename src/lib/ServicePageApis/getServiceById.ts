import { ServiceData, SingleServiceResponse } from "@/types/ServiceDataType";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getServiceById(id: string): Promise<ServiceData | null> {
  try {
    const response = await api.get<SingleServiceResponse>(
      `/api/v1/public/service-section/provide-service/${id}`
    );

    if (!response.data.success || !response.data.data) {
      return null;
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching service:", {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    } else {
      console.error("Unexpected error fetching service:", error);
    }
    return null;
  }
}