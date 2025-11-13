// import axios from 'axios';
// import { LandingPageResponse } from '@/types/ProductType';

// export async function fetchLandingPageProducts() {
//   const baseUrl = process.env.NEXTAUTH_URL;

//   if (!baseUrl) {
//     console.error('NEXTAUTH_URL is not configured');
//     return { runningOffers: [], bestSelling: [], randomProducts: [] };
//   }

//   try {
//     const response = await axios.get<LandingPageResponse>(
//       `${baseUrl}/api/v1/product/landingPage`,
//       {
//         headers: {
//           'Cache-Control': 'no-store',
//           'Pragma': 'no-cache',
//         },
//         timeout: 10000,
//       }
//     );

//     if (response.data.success && response.data.data) {
//       return response.data.data;
//     }

//     console.warn('Invalid response from landing page API', response.data);
//     return { runningOffers: [], bestSelling: [], randomProducts: [] };
//   } catch (error: any) {
//     console.error('Failed to fetch landing page products:', {
//       message: error.response?.data?.message || error.message,
//       status: error.response?.status,
//     });
//     return { runningOffers: [], bestSelling: [], randomProducts: [] };
//   }
// }

// src/lib/MainHomePage/fetchLandingPageProducts.ts
import axios from 'axios';
import { unstable_cache } from 'next/cache';
import { LandingPageResponse } from '@/types/ProductType';

const getCachedLandingPageProducts = unstable_cache(
  async () => {
    const baseUrl = process.env.NEXTAUTH_URL;

    if (!baseUrl) {
      console.error('NEXTAUTH_URL is not configured');
      return { runningOffers: [], bestSelling: [], randomProducts: [] };
    }

    try {
      const response = await axios.get<LandingPageResponse>(
        `${baseUrl}/api/v1/product/landingPage`,
        { timeout: 10000 }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      console.warn('Invalid response from landing page API', response.data);
      return { runningOffers: [], bestSelling: [], randomProducts: [] };
    } catch (error: any) {
      console.error('Failed to fetch landing page products:', {
        message: error.response?.data?.message || error.message,
      });
      return { runningOffers: [], bestSelling: [], randomProducts: [] };
    }
  },
  ['landing-page-products'],
  {
    revalidate: 1,
  }
);

export async function fetchLandingPageProducts() {
  return await getCachedLandingPageProducts();
}