import type { Metadata, Viewport } from 'next';
import './globals.css';
import SessionProviderWrapper from '@/Providers/SessionProviderWrapper';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';
import PathnameDetector from '@/Providers/PathnameDetector';
import { AuthProvider } from '@/contexts/AuthContext';
import MessageIcon from './components/MessageIcon';
import "@smastrom/react-rating/style.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.guptodhan.com';
const appName = 'Guptodhan';
const appDescription =
  "Bangladesh's trusted multi-vendor marketplace. Buy, sell, donate products, and access professional services. Secure transactions, fast delivery, and quality guaranteed.";

async function getIntegrations() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/v1/public/integrations`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

function extractVerificationCode(fullCode: string): string {
  if (!fullCode) return '';
  return fullCode.replace('google-site-verification=', '').trim();
}

// ✅ Viewport আলাদা export — এটা করলে Next.js duplicate viewport tag যোগ করবে না
// <head> এ আর কোনো <meta name="viewport"> দেওয়া যাবে না!
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata(): Promise<Metadata> {
  const integrations = await getIntegrations();
  const verificationCode =
    integrations?.googleSearchConsoleEnabled && integrations?.googleSearchConsoleId
      ? extractVerificationCode(integrations.googleSearchConsoleId)
      : undefined;

  return {
    metadataBase: new URL(baseUrl),

    // ✅ Short template — product title এর সাথে "| Guptodhan" যোগ হবে
    // "Guptodhan - Online Marketplace" লম্বা করলে SEO title বড় হয়ে যায়
    title: {
      default: `${appName} - Online Marketplace Bangladesh`,
      template: `%s | ${appName}`,
    },

    // ✅ একটি মাত্র description — head এ আর দেওয়া নিষেধ
    description: appDescription,

    keywords: [
      'multi-vendor marketplace Bangladesh',
      'buy sell online Bangladesh',
      'donate products',
      'professional services Bangladesh',
      'ecommerce Bangladesh',
      'online shopping BD',
      'Guptodhan',
    ],

    authors: [{ name: appName }],
    creator: appName,
    publisher: appName,

    // ✅ OG image — শুধু site-level fallback
    // Product page নিজের thumbnailImage দেবে, layout এর image override করবে না
    openGraph: {
      title: `${appName} - Multi-Vendor Marketplace Bangladesh`,
      description: appDescription,
      url: baseUrl,
      siteName: appName,
      // ✅ og-image.png public folder এ না থাকলে logo ব্যবহার করুন
      // অথবা একটি 1200x630 image তৈরি করে /public/og-image.jpg রাখুন
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${appName} - Online Marketplace Bangladesh`,
          type: 'image/jpeg',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${appName} - Multi-Vendor Marketplace`,
      description: appDescription,
      images: [`${baseUrl}/og-image.jpg`],
      creator: '@guptodhan',
      site: '@guptodhan',
    },

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

    // ✅ শুধু Google verification — Bing/Pinterest placeholder সরানো হয়েছে
    ...(verificationCode && {
      verification: { google: verificationCode },
    }),

    alternates: {
      canonical: baseUrl,
    },

    icons: {
      icon: '/icon.svg',
      apple: '/apple-touch-icon.png',
    },

    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: appName,
    },

    formatDetection: {
      telephone: true,
      email: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const integrations = await getIntegrations();

  return (
    // ✅ lang="en" — ISO format, "english" বা "bangla" নয়
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* ✅ charSet শুধু এখানে */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* ❌ REMOVED: <meta name="viewport"> — viewport export দিয়েছি উপরে */}
        {/* ❌ REMOVED: <meta name="language" content="English, Bangla"> — SEO error */}
        {/* ❌ REMOVED: <meta name="description"> — metadata.description থেকে আসে */}

        {/* Mobile / PWA */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={appName} />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* Critical asset preload */}
        <link rel="preload" as="image" href="/logo.png" />

        {/* ─── Website JSON-LD ─────────────────────────────────────────── */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Guptodhan',
              url: baseUrl,
              description: appDescription,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${baseUrl}/products?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* ─── Organization JSON-LD ────────────────────────────────────── */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Guptodhan',
              url: baseUrl,
              logo: `${baseUrl}/logo.png`,
              description: appDescription,
              sameAs: [
                'https://www.facebook.com/guptodhan',
                'https://www.instagram.com/guptodhan',
                'https://twitter.com/guptodhan',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'support@guptodhan.com',
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'BD',
              },
            }),
          }}
        />

        {/* ─── Google Analytics ────────────────────────────────────────── */}
        {integrations?.googleAnalyticsEnabled && integrations?.googleAnalyticsId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${integrations.googleAnalyticsId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${integrations.googleAnalyticsId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* ─── Google Tag Manager ──────────────────────────────────────── */}
        {integrations?.googleTagManagerEnabled && integrations?.gtmId && (
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${integrations.gtmId}');`,
            }}
          />
        )}

        {/* ─── Facebook Pixel ──────────────────────────────────────────── */}
        {integrations?.facebookPixelEnabled && integrations?.facebookPixelId && (
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${integrations.facebookPixelId}');
fbq('track', 'PageView');`,
            }}
          />
        )}

        {/* ─── Microsoft Clarity ───────────────────────────────────────── */}
        {integrations?.microsoftClarityEnabled && integrations?.microsoftClarityId && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${integrations.microsoftClarityId}");`,
            }}
          />
        )}

        {/* ─── Tawk.to ─────────────────────────────────────────────────── */}
        {integrations?.tawkToEnabled && integrations?.tawkToLink && (
          <Script
            id="tawk-chat"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();
(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;s1.src='${integrations.tawkToLink}';s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0);})();`,
            }}
          />
        )}

        {/* ─── Crisp Chat ──────────────────────────────────────────────── */}
        {integrations?.crispChatEnabled && integrations?.crispWebsiteId && (
          <Script
            id="crisp-chat"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.$crisp=[];window.CRISP_WEBSITE_ID="${integrations.crispWebsiteId}";
(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";
s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`,
            }}
          />
        )}

        {/* ─── Google reCAPTCHA ────────────────────────────────────────── */}
        {integrations?.googleRecaptchaEnabled && integrations?.recaptchaSiteKey && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${integrations.recaptchaSiteKey}`}
            strategy="lazyOnload"
          />
        )}
      </head>

      <body
        style={{
          fontFamily: '"Hind Siliguri", "Roboto", "Segoe UI", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
        className="antialiased bg-white text-slate-900"
      >
        {/* GTM noscript */}
        {integrations?.googleTagManagerEnabled && integrations?.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${integrations.gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <SessionProviderWrapper>
          <AuthProvider>
            <PathnameDetector>
              <div className="fixed bottom-6 right-6 z-50">
                <MessageIcon />
              </div>

              {children}

              <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy="lazyOnload"
              />
              <Toaster position="top-center" />
            </PathnameDetector>
          </AuthProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}