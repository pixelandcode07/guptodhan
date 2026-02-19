import type { Metadata } from 'next';
import './globals.css';
import SessionProviderWrapper from '@/Providers/SessionProviderWrapper';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';
import PathnameDetector from '@/Providers/PathnameDetector';
import { AuthProvider } from '@/contexts/AuthContext';
import MessageIcon from './components/MessageIcon';
import "@smastrom/react-rating/style.css";

// ✅ REMOVED: force-dynamic and force-no-store (এগুলো সব page কে slow করছিল)
// export const dynamic = 'force-dynamic';
// export const fetchCache = 'force-no-store';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.guptodhan.com';
const appName = 'Guptodhan';
const appDescription =
  'Guptodhan is Bangladesh\'s most trusted multi-vendor marketplace. Buy, sell, donate products, and access professional services all in one platform. Secure transactions, fast delivery, and quality assurance guaranteed.';

/**
 * ✅ FIXED: Integrations fetch এ cache যোগ করা হয়েছে (আগে no-store ছিল)
 * এখন 5 মিনিট cache থাকবে, প্রতি request এ API call হবে না
 */
async function getIntegrations() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/v1/public/integrations`, {
      next: { revalidate: 300 }, // ✅ 5 মিনিট cache
    });

    if (!res.ok) {
      throw new Error('Failed to fetch integrations');
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return null;
  }
}

/**
 * Extract Google Search Console verification code
 */
function extractVerificationCode(fullCode: string): string {
  if (!fullCode) return '';
  if (fullCode.includes('google-site-verification=')) {
    return fullCode.replace('google-site-verification=', '').trim();
  }
  return fullCode.trim();
}

/**
 * Generate comprehensive metadata for SEO
 */
export async function generateMetadata(): Promise<Metadata> {
  const integrations = await getIntegrations();
  const verificationCode =
    integrations?.googleSearchConsoleEnabled &&
      integrations?.googleSearchConsoleId
      ? extractVerificationCode(integrations.googleSearchConsoleId)
      : 'your-google-site-verification-code';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${appName} - Multi-Vendor Marketplace | Buy, Sell, Donate & Services in Bangladesh`,
      template: `%s | ${appName} - Online Marketplace`,
    },
    description: appDescription,
    keywords: [
      'multi-vendor marketplace',
      'buy sell online',
      'donate products',
      'professional services',
      'ecommerce Bangladesh',
      'online shopping',
      'digital marketplace',
      'online services',
      'buy online Bangladesh',
      'sell online Bangladesh',
    ],
    authors: [{ name: appName }],
    creator: appName,
    publisher: appName,

    openGraph: {
      title: `${appName} - Your Trusted Multi-Vendor Marketplace`,
      description: appDescription,
      url: baseUrl,
      siteName: appName,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${appName} - Multi-Vendor Marketplace`,
          type: 'image/png',
        },
        {
          url: `${baseUrl}/og-image-square.png`,
          width: 800,
          height: 800,
          alt: `${appName} Logo`,
          type: 'image/png',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${appName} - Multi-Vendor Marketplace`,
      description: appDescription,
      images: [`${baseUrl}/og-image.png`],
      creator: '@guptodhan',
      site: '@guptodhan',
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    verification: {
      google: verificationCode,
      other: {
        'msvalidate.01': 'your-bing-verification-code',
        'p:domain_verify': 'your-pinterest-verification-code',
      },
    },

    alternates: {
      canonical: baseUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'bn': `${baseUrl}/bn`,
        'x-default': baseUrl,
      },
    },

    icons: {
      icon: [
        { url: '/icon.svg' },
        { url: '/icon.svg', sizes: '16x16', type: '/icon.svg' },
        { url: '/icon.svg', sizes: '32x32', type: '/icon.svg' },
      ],
      apple: [
        { url: '/apple-touch-icon.png' },
      ],
    },

    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: appName,
    },

    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
  };
}

/**
 * Root Layout Component
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const integrations = await getIntegrations();

  return (
    <html
      lang="en"
      className="scroll-smooth"
      suppressHydrationWarning
      style={{
        fontSize: '16px',
        scrollBehavior: 'smooth',
      }}
    >
      <head>
        {/* ========================
            CHARACTER & LANGUAGE
            ======================== */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="language" content="English, Bangla" />

        {/* ========================
            ✅ FIXED: GOOGLE FONTS — Non-render-blocking
            আগে এটি page render block করছিল
            এখন media="print" trick দিয়ে async load হবে
            ======================== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Kalpurush&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
          media="print"
          // @ts-ignore
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Kalpurush&family=Roboto:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
        </noscript>

        {/* ========================
            GOOGLE ANALYTICS
            ======================== */}
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
                    page_title: document.title,
                  });
                `,
              }}
            />
          </>
        )}

        {/* ========================
            GOOGLE TAG MANAGER (HEAD)
            ======================== */}
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

        {/* ========================
            FACEBOOK PIXEL
            ======================== */}
        {integrations?.facebookPixelEnabled && integrations?.facebookPixelId && (
          <>
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
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${integrations.facebookPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        {/* ========================
            MICROSOFT CLARITY
            ======================== */}
        {integrations?.microsoftClarityEnabled && integrations?.microsoftClarityId && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${integrations.microsoftClarityId}");
            `,
            }}
          />
        )}

        {/* ========================
            GOOGLE RECAPTCHA
            ======================== */}
        {integrations?.googleRecaptchaEnabled && integrations?.recaptchaSiteKey && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${integrations.recaptchaSiteKey}`}
            strategy="lazyOnload"
          />
        )}

        {/* ========================
            CRISP CHAT
            ======================== */}
        {integrations?.crispChatEnabled && integrations?.crispWebsiteId && (
          <Script
            id="crisp-chat"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.$crisp=[];
                window.CRISP_WEBSITE_ID="${integrations.crispWebsiteId}";
                (function(){
                  d=document;
                  s=d.createElement("script");
                  s.src="https://client.crisp.chat/l.js";
                  s.async=1;
                  d.getElementsByTagName("head")[0].appendChild(s);
                })();
              `,
            }}
          />
        )}

        {/* ========================
            TAWK.TO CHAT
            ======================== */}
        {integrations?.tawkToEnabled && integrations?.tawkToLink && (
          <Script
            id="tawk-chat"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                (function(){
                  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                  s1.async=true;
                  s1.src='${integrations.tawkToLink}';
                  s1.charset='UTF-8';
                  s1.setAttribute('crossorigin','*');
                  s0.parentNode.insertBefore(s1,s0);
                })();
              `,
            }}
          />
        )}

        {/* ========================
            FACEBOOK MESSENGER CHAT
            ======================== */}
        {integrations?.messengerChatEnabled && integrations?.messengerLink && (
          <Script
            id="facebook-messenger-sdk"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.fbAsyncInit = function() {
                  FB.init({
                    xfbml: true,
                    version: 'v18.0'
                  });
                };
                (function(d, s, id) {
                  var js, fjs = d.getElementsByTagName(s)[0];
                  if (d.getElementById(id)) return;
                  js = d.createElement(s); js.id = id;
                  js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
                  fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
              `,
            }}
          />
        )}

        {/* ========================
            STRUCTURED DATA (JSON-LD)
            ======================== */}
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
              image: `${baseUrl}/og-image.png`,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${baseUrl}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

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
                'https://www.youtube.com/guptodhan',
                'https://www.twitter.com/guptodhan',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                telephone: '+880-1234-567890',
                email: 'support@guptodhan.com',
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'BD',
                addressRegion: 'Bangladesh',
              },
            }),
          }}
        />

        {/* ========================
            META TAGS - Mobile & App
            ======================== */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Guptodhan" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-navbutton-color" content="#3B82F6" />

        {/* ========================
            SEO & BRAND
            ======================== */}
        <meta name="author" content="Guptodhan" />
        <meta name="copyright" content="© 2024 Guptodhan. All rights reserved." />
        <meta name="description" content={appDescription} />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />

        {/* ========================
            PRELOAD CRITICAL ASSETS
            ======================== */}
        <link rel="preload" as="image" href="/logo.png" />
        <link rel="preload" as="image" href="/og-image.png" />

        {/* ========================
            DNS PREFETCH
            ======================== */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>

      <body
        style={{
          fontFamily:
            '"Hind Siliguri", "Kalpurush", "Roboto", "Segoe UI", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
        className="antialiased bg-white text-slate-900"
      >
        {/* ========================
            GOOGLE TAG MANAGER (NOSCRIPT)
            ======================== */}
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

        {/* ========================
            FACEBOOK MESSENGER CHAT PLUGIN
            ======================== */}
        {integrations?.messengerChatEnabled && integrations?.messengerLink && (
          <div
            id="fb-root"
            className="fb-customerchat"
            data-page-id={integrations.messengerLink}
            data-attribution="setup_tool"
          />
        )}

        {/* ========================
            APP PROVIDERS & LAYOUT
            ======================== */}
        <SessionProviderWrapper>
          <AuthProvider>
            <PathnameDetector>
              {/* Floating Message Icon */}
              <div className="fixed bottom-6 right-6 z-50">
                <MessageIcon />
              </div>

              {/* Main Content */}
              {children}

              {/* ✅ FIXED: Google Maps API — beforeInteractive → lazyOnload
                  আগে এটি page render block করছিল */}
              <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy="lazyOnload"
              />

              {/* Toast Notifications */}
              <Toaster position="top-center" />
            </PathnameDetector>
          </AuthProvider>
        </SessionProviderWrapper>

        {/* ========================
            PERFORMANCE & OPTIMIZATION
            ======================== */}
        <noscript>
          <p>
            This application requires JavaScript to be enabled to function properly.
            Please enable JavaScript in your browser settings.
          </p>
        </noscript>
      </body>
    </html>
  );
}