import { AllServicesResponse, ServiceData } from "@/types/ServiceDataType";
import axios from "axios";

export const fetchAllServiceAds = async (
    token: string | undefined
): Promise<ServiceData[]> => {
    // 1. Server side e URL full thaka mandatory. Fallback rakha holo.
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 2. Jodi token na thake, error throw na kore empty array return kora safe (Public view hole)
    // Ar jodi eta Protected hoy, tahole error throw kora thik ache, kintu page.tsx e handle korte hobe.
    if (!token) {
        console.warn("No token provided for fetching service ads.");
        return []; // Crash na kore empty data pathano better logic
    }

    try {
        const response = await axios.get<AllServicesResponse>(
            `${baseUrl}/api/v1/service-section/provide-service`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                // Cache control for Next.js server components
                headers: {
                    "Cache-Control": "no-store",
                    "Pragma": "no-cache",
                    "Expires": "0",
                } as any
            }
        );

        return response.data.data?.services || [];
    } catch (error: any) {
        console.error(
            'Error fetching service ads:',
            error?.response?.data?.message || error.message
        );
        // Error holeo empty array return koro jate page crash na kore
        return [];
    }
};