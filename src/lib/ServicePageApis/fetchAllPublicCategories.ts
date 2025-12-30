import { ApiResponse, IServiceCategory } from "@/types/ServiceCategoryType";
import axios from "axios";


export const fetchAllPublicServiceCategories = async (): Promise<IServiceCategory[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
        console.error("API base URL is not configured");
        return [];
    }

    try {
        const response = await axios.get<ApiResponse<IServiceCategory[]>>(
            `${baseUrl}/api/v1/public/service-section/service-category`
        );

        return response.data.data;
    } catch (error: any) {
        console.error(
            "Axios Error: Failed to fetch public service categories",
            error.message || error
        );
        const errorMessage =
            error.response?.data?.message ||
            "Failed to fetch service categories. Please try again later.";

        throw new Error(errorMessage);
    }
};