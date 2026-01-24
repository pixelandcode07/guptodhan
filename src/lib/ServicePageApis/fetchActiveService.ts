import axios from "axios";
import {
    ApiResponse,
    AllServicesData,
    ServiceData,
} from "@/types/ServiceDataType";

export const fetchActiveService = async (): Promise<ServiceData[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
        console.error("API base URL is not configured");
        return [];
    }

    try {
        const response = await axios.get<ApiResponse<AllServicesData>>(
            `${baseUrl}/api/v1/public/service-section/provide-service`
        );

        return response.data.data.services;
    } catch (error: any) {
        console.error(
            "Axios Error: Failed to fetch active services",
            error.message || error
        );

        const errorMessage =
            error.response?.data?.message ||
            "Failed to fetch active services";

        throw new Error(errorMessage);
    }
};
