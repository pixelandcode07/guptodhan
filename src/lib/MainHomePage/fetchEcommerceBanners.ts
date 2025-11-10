import { ApiResponse, EcommerceBannerType } from '@/types/ecommerce-banner-type';
import axios from 'axios';


export async function fetchEcommerceBanners(): Promise<{
    leftBanners: EcommerceBannerType[];
    rightBanners: EcommerceBannerType[];
    bottomBanners: EcommerceBannerType[];
    middleHomepage: EcommerceBannerType[];
    topShoppage: EcommerceBannerType[];
}> {
    const baseUrl = process.env.NEXTAUTH_URL;

    try {
        const [leftRes, rightRes, bottomRes, middleHomeRes, topShopRes] = await Promise.all([
            axios.get<ApiResponse<EcommerceBannerType[]>>(
                `${baseUrl}/api/v1/public/ecommerce-banners?position=left-homepage`
            ),
            axios.get<ApiResponse<EcommerceBannerType[]>>(
                `${baseUrl}/api/v1/public/ecommerce-banners?position=right-homepage`
            ),
            axios.get<ApiResponse<EcommerceBannerType[]>>(
                `${baseUrl}/api/v1/public/ecommerce-banners?position=bottom-homepage`
            ),
            axios.get<ApiResponse<EcommerceBannerType[]>>(
                `${baseUrl}/api/v1/public/ecommerce-banners?position=middle-homepage`
            ),
            axios.get<ApiResponse<EcommerceBannerType[]>>(
                `${baseUrl}/api/v1/public/ecommerce-banners?position=top-shoppage`
            ),  
        ]);

        return {
            leftBanners: leftRes.data?.data || [],
            rightBanners: rightRes.data?.data || [],
            bottomBanners: bottomRes.data?.data || [],
            middleHomepage: middleHomeRes.data?.data || [],
            topShoppage: topShopRes.data?.data || [],
        };
    } catch (error) {
        console.error('❌ Failed to fetch eCommerce banners:', error);
        return { leftBanners: [], rightBanners: [], bottomBanners: [], middleHomepage: [], topShoppage: [] };
    }
}
