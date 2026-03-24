import type { NextConfig } from 'next';

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
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,

  // ========================
  // REDIRECTS
  // ========================
  async redirects() {
    return [];
  },

  // ========================
  // IMAGE OPTIMIZATION
  // ========================
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.guptodhan.com', pathname: '/**' },
      { protocol: 'https', hostname: 'guptodhan.com', pathname: '/**' },
      { protocol: 'https', hostname: 'app-area.guptodhan.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'http', hostname: '76.13.191.238', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.guptodhan.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ibb.co', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ibb.co.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.imgur.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'via.placeholder.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn-icons-png.flaticon.com', pathname: '/**' },
      { protocol: 'https', hostname: 'static.vecteezy.com', pathname: '/**' },
      { protocol: 'https', hostname: 'github.com', pathname: '/**' },
      { protocol: 'https', hostname: 'example.com', pathname: '/**' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
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
  // SECURITY & CACHE HEADERS
  // ========================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }],
      },
      {
        source: '/product/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
        ],
      },
    ];
  },

  // ========================
  // EXPERIMENTAL
  // ========================
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-table', 'recharts'],
    esmExternals: true,

    // ✅ FIX: SSLCommerz তাদের server থেকে callback URL এ POST করে।
    // Next.js এই POST কে Server Action মনে করে এবং origin mismatch এ block করে দেয়।
    // allowedOrigins এ SSLCommerz domains add করলে এই block উঠে যায়।
    serverActions: {
      allowedOrigins: [
        'guptodhan.com',
        'www.guptodhan.com',
        'sandbox.sslcommerz.com',    // SSLCommerz sandbox server (testing)
        'securepay.sslcommerz.com',  // SSLCommerz production server (live)
        'sslcommerz.com',
      ],
    },
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  trailingSlash: false,
};

export default nextConfig;