// ===============================================
// FILE 1: src/app/layout.tsx (UPDATED)
// ===============================================

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SessionProviderWrapper from '@/Providers/SessionProviderWrapper';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';
import PathnameDetector from '@/Providers/PathnameDetector';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.guptodhandigital.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Guptodhan - Buy, Sell & Donate Products Online in Bangladesh',
    template: '%s | Guptodhan',
  },
  description: 'Guptodhan is a trusted marketplace to buy, sell, and donate products online in Bangladesh. Secure transactions, quality products, and fast delivery.',
  keywords: ['marketplace', 'buy sell', 'donate products', 'Bangladesh', 'ecommerce', 'online shopping'],
  
  // Open Graph (for social media sharing)
  openGraph: {
    title: 'Guptodhan - Your Trusted Marketplace',
    description: 'Buy, sell, and donate products securely on Guptodhan.',
    url: baseUrl,
    siteName: 'Guptodhan',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Guptodhan Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Guptodhan - Your Trusted Marketplace',
    description: 'Buy, sell, and donate products securely.',
    images: [`${baseUrl}/og-image.png`],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: 'your-google-site-verification-code', // ডালতে আপনার কোড
    // yandex: 'your-yandex-verification-code',
  },

  // Alternative Links
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': `${baseUrl}/en`,
      'bn-BD': `${baseUrl}/bn`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* Mobile App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#3B82F6" />

        {/* Additional SEO */}
        <meta name="author" content="Guptodhan" />
        <meta name="copyright" content="© 2024 Guptodhan. All rights reserved." />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper>
          <PathnameDetector>
            {children}
            <Script
              src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
              strategy="beforeInteractive"
            />
            <Toaster position="top-center" />
          </PathnameDetector>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
