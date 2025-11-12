// import { ApiResponse, EcommerceBannerType, EcommerceSliderBannerType } from '@/types/ecommerce-banner-type';
// import axios from 'axios';


// export async function fetchEcommerceBanners(): Promise<{
//     // leftBanners: EcommerceBannerType[];
//     leftBanners: EcommerceSliderBannerType[];
//     rightBanners: EcommerceBannerType[];
//     bottomBanners: EcommerceBannerType[];
//     middleHomepage: EcommerceBannerType[];
//     topShoppage: EcommerceBannerType[];
// }> {
//     const baseUrl = process.env.NEXTAUTH_URL;

//     try {
//         const [leftRes, rightRes, bottomRes, middleHomeRes, topShopRes] = await Promise.all([
//             axios.get<ApiResponse<EcommerceSliderBannerType[]>>(
//                 // `${baseUrl}/api/v1/public/ecommerce-banners?position=left-homepage`
//                 `${baseUrl}/api/v1/slider-form`
//             ),
//             axios.get<ApiResponse<EcommerceBannerType[]>>(
//                 `${baseUrl}/api/v1/public/ecommerce-banners?position=right-homepage`
//             ),
//             axios.get<ApiResponse<EcommerceBannerType[]>>(
//                 `${baseUrl}/api/v1/public/ecommerce-banners?position=bottom-homepage`
//             ),
//             axios.get<ApiResponse<EcommerceBannerType[]>>(
//                 `${baseUrl}/api/v1/public/ecommerce-banners?position=middle-homepage`
//             ),
//             axios.get<ApiResponse<EcommerceBannerType[]>>(
//                 `${baseUrl}/api/v1/public/ecommerce-banners?position=top-shoppage`
//             ),  
//         ]);

//         return {
//             leftBanners: leftRes.data?.data || [],
//             rightBanners: rightRes.data?.data || [],
//             bottomBanners: bottomRes.data?.data || [],
//             middleHomepage: middleHomeRes.data?.data || [],
//             topShoppage: topShopRes.data?.data || [],
//         };
//     } catch (error) {
//         console.error('❌ Failed to fetch eCommerce banners:', error);
//         return { leftBanners: [], rightBanners: [], bottomBanners: [], middleHomepage: [], topShoppage: [] };
//     }
// }


// src/lib/MainHomePage/fetchEcommerceBanners.ts

import axios, { AxiosError } from 'axios';
import { ApiResponse, EcommerceBannerType, EcommerceSliderBannerType } from '@/types/ecommerce-banner-type';

interface EcommerceBannersResponse {
  leftBanners: EcommerceSliderBannerType[];
  rightBanners: EcommerceBannerType[];
  bottomBanners: EcommerceBannerType[];
  middleHomepage: EcommerceBannerType[];
  topShoppage: EcommerceBannerType[];
}

export async function fetchEcommerceBanners(): Promise<EcommerceBannersResponse> {
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!baseUrl) {
    console.error('NEXTAUTH_URL is not configured');
    return {
      leftBanners: [],
      rightBanners: [],
      bottomBanners: [],
      middleHomepage: [],
      topShoppage: [],
    };
  }

  const headers = {
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
  };

  try {
    // Parallel API calls
    const [
      leftSliderRes,
      rightRes,
      bottomRes,
      middleRes,
      topShopRes,
    ] = await Promise.all([
      axios.get<ApiResponse<EcommerceSliderBannerType[]>>(`${baseUrl}/api/v1/slider-form`, { headers }).catch(() => ({ data: { data: [] } })),
      axios.get<ApiResponse<EcommerceBannerType[]>>(`${baseUrl}/api/v1/public/ecommerce-banners?position=right-homepage`, { headers }).catch(() => ({ data: { data: [] } })),
      axios.get<ApiResponse<EcommerceBannerType[]>>(`${baseUrl}/api/v1/public/ecommerce-banners?position=bottom-homepage`, { headers }).catch(() => ({ data: { data: [] } })),
      axios.get<ApiResponse<EcommerceBannerType[]>>(`${baseUrl}/api/v1/public/ecommerce-banners?position=middle-homepage`, { headers }).catch(() => ({ data: { data: [] } })),
      axios.get<ApiResponse<EcommerceBannerType[]>>(`${baseUrl}/api/v1/public/ecommerce-banners?position=top-shoppage`, { headers }).catch(() => ({ data: { data: [] } })),
    ]);

    return {
      leftBanners: leftSliderRes.data?.data || [],
      rightBanners: rightRes.data?.data || [],
      bottomBanners: bottomRes.data?.data || [],
      middleHomepage: middleRes.data?.data || [],
      topShoppage: topShopRes.data?.data || [],
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Failed to fetch ecommerce banners:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    } else {
      console.error('Unexpected error in fetchEcommerceBanners:', error);
    }

    return {
      leftBanners: [],
      rightBanners: [],
      bottomBanners: [],
      middleHomepage: [],
      topShoppage: [],
    };
  }
}