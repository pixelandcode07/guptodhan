import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SessionProviderWrapper from '@/Providers/SessionProviderWrapper';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';
import PathnameDetector from '@/Providers/PathnameDetector';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Guptodhan',
  description: 'Your trusted marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
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

