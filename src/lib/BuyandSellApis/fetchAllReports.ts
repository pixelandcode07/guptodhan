
import { ReportListing } from '@/types/ReportType';
import { ApiResponse } from '@/types/VendorType';
import axios, { AxiosError } from 'axios';

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.host}`;
    }
    const url = process.env.NEXTAUTH_URL;
    if (!url) {
        console.error('NEXTAUTH_URL is not set in .env.local');
        throw new Error('API base URL is missing');
    }
    return url;
};

export async function fetchAllReports(token?: string): Promise<ReportListing[]> {
    const baseUrl = getBaseUrl();

    try {
        const headers: Record<string, string> = {
            'Cache-Control': 'no-store',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get<ApiResponse<ReportListing[]>>(
            `${baseUrl}/api/v1/reports`,
            { headers }
        );

        if (response.data.success && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        console.warn('Reports API: invalid response', response.data);
        return [];
    } catch (error) {
        if (error instanceof AxiosError) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;
            console.error('Failed to fetch reports:', { status, message });
        } else if (error instanceof Error) {
            console.error('Unexpected error:', error.message);
        }
        return [];
    }
}