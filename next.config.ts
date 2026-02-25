import type { NextConfig } from 'next';

// Interface for custom Webpack configuration
interface WebpackConfig {
  optimization?: {
    splitChunks?: {
      chunks?: string;
      cacheGroups?: Record<string, any>;
    };
  };
  [key: string]: any;
}

const nextConfig: NextConfig = {
  // ========================
  // CORE PERFORMANCE
  // ========================
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,

  // ========================
  // IMAGE OPTIMIZATION
  // ========================
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.publicdomainpictures.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'app-area.guptodhan.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons.flaticon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'guptodhan.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    unoptimized: false,
    dangerouslyAllowSVG: true,
  },

  // ========================
  // WEBPACK OPTIMIZATION
  // ========================
  webpack: (config: WebpackConfig, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              name: 'react-vendors',
              priority: 20,
              reuseExistingChunk: true,
              enforce: true,
            },
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  // ========================
  // CACHING & CDN OPTIMIZATION
  // ========================
  async headers() {
    return [
      // SECURITY HEADERS
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      // LONG-TERM CACHE FOR STATIC ASSETS
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // IMAGES CACHING
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // FONTS CACHING
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ✅ PUBLIC PAGES — 1 মিনিট cache (আগে কোনো cache ছিল না)
      {
        source: '/((?!api|_next|general|auth).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      // API RESPONSES - No cache
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, max-age=0',
          },
        ],
      },
    ];
  },

  // ========================
  // PERFORMANCE OPTIMIZATION
  // ========================
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  // ========================
  // EXPERIMENTAL OPTIMIZATIONS
  // ========================
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tanstack/react-table',
      'recharts',
    ],
    esmExternals: true,
  },

  // ========================
  // TYPESCRIPT
  // ========================
  typescript: {
    ignoreBuildErrors: true,
  },

  // ========================
  // MISC OPTIMIZATIONS
  // ========================
  trailingSlash: false,

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;