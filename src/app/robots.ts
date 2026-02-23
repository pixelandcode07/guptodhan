import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/vendor/dashboard/',
          '/api/',
          '/auth/',
          '/private/',
          '/general/',       // ✅ Admin panel pages — index হওয়া উচিত না
          '/home/UserProfile/', // ✅ User private pages
          '/home/products/shopping-cart/',
          '/home/product/shoppinginfo/',
          '/home/product/tracking/',
        ],
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
        disallow: [
          '/api/',
          '/general/',
        ],
      },
      {
        // ✅ Bingbot আলাদাভাবে handle
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/general/',
          '/auth/',
        ],
      },
    ],
    sitemap: 'https://www.guptodhandigital.com/sitemap.xml',
  };
}