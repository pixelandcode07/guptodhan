import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.guptodhan.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ─── Default: সব বট ─────────────────────────────────────────
      {
        userAgent: '*',
        allow: [
          '/',
          '/product/',
          '/products',
          '/category/',
          '/services',
          '/buy-sell',
          '/donation',
          '/blogs',
          '/about-us',
          '/contact-us',
          '/return-policy',
          '/privacy-policy',
          '/terms-conditions',
          '/shipping-policy',
        ],
        disallow: [
          '/general/',              // Admin panel
          '/api/',                  // API routes
          '/auth/',                 // Auth routes
          '/home/UserProfile/',     // User profile
          '/products/shopping-cart/',
          '/products/shoppinginfo/',
          '/products/tracking/',
          '/products/order-tracking/',
          '/service/register',
          '/service/login',
          '/withdrawal/',
          '/dashboard/',
          '/admin/',
          '/private/',
          '/track-order',
          '/return',
          '/search',
        ],
      },

      // ─── Googlebot ──────────────────────────────────────────────
      {
        userAgent: 'Googlebot',
        allow: ['/product/', '/category/', '/products'],
        disallow: [
          '/search', '/general/', '/api/', '/auth/',
          '/home/UserProfile/', '/products/shopping-cart/',
          '/products/shoppinginfo/', '/withdrawal/', '/dashboard/',
        ],
      },

      // ─── Googlebot-Image: product image সব allow ────────────────
      {
        userAgent: 'Googlebot-Image',
        allow: ['/'],
      },

      // ─── AdsBot Google Shopping ──────────────────────────────────
      {
        userAgent: 'AdsBot-Google',
        allow: ['/product/'],
        disallow: ['/general/', '/api/', '/auth/', '/dashboard/'],
      },
      {
        userAgent: 'AdsBot-Google-Mobile',
        allow: ['/product/'],
        disallow: ['/general/', '/api/', '/auth/', '/dashboard/'],
      },

      // ─── Bingbot ─────────────────────────────────────────────────
      {
        userAgent: 'Bingbot',
        allow: ['/product/', '/category/', '/products'],
        disallow: ['/search', '/general/', '/api/', '/auth/', '/dashboard/'],
      },
    ],

    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}