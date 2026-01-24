import axios from "axios";
import {
  ApiResponse,
  AllServicesData,
  ServiceData,
} from "@/types/ServiceDataType";

export const fetchProviderServices = async (
  providerId: string,
  token: string
): Promise<ServiceData[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error("API base URL is not configured");
    return [];
  }

  if (!providerId) {
    throw new Error("Provider ID is required");
  }

  if (!token) {
    throw new Error("Authentication token is required");
  }

  try {
    const response = await axios.get<ApiResponse<AllServicesData>>(
      `${baseUrl}/api/v1/service-section/provide-service/providerId/${providerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data.services;
  } catch (error: any) {
    console.error(
      "Axios Error: Failed to fetch provider services",
      error.message || error
    );

    const errorMessage =
      error.response?.data?.message ||
      "Failed to fetch provider services. Authentication may have expired.";

    throw new Error(errorMessage);
  }
};
