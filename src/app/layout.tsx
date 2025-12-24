import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SessionProviderWrapper from '@/Providers/SessionProviderWrapper';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';
import PathnameDetector from '@/Providers/PathnameDetector';
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.guptodhandigital.com';

// Fetch integrations from PUBLIC API
async function getIntegrations() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/v1/public/integrations`, {
      cache: 'no-store',
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

// Helper function to extract verification code
function extractVerificationCode(fullCode: string): string {
  if (!fullCode) return '';
  // If it contains "google-site-verification=", extract only the code part
  if (fullCode.includes('google-site-verification=')) {
    return fullCode.replace('google-site-verification=', '').trim();
  }
  return fullCode.trim();
}

export async function generateMetadata(): Promise<Metadata> {
  const integrations = await getIntegrations();
  const verificationCode = integrations?.googleSearchConsoleEnabled && integrations?.googleSearchConsoleId
    ? extractVerificationCode(integrations.googleSearchConsoleId)
    : 'your-google-site-verification-code';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: 'Guptodhan - Buy, Sell & Donate Products Online in Bangladesh',
      template: '%s | Guptodhan',
    },
    description:
      'Guptodhan is a trusted marketplace to buy, sell, and donate products online in Bangladesh. Secure transactions, quality products, and fast delivery.',
    keywords: [
      'marketplace',
      'buy sell',
      'donate products',
      'Bangladesh',
      'ecommerce',
      'online shopping',
    ],

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

    twitter: {
      card: 'summary_large_image',
      title: 'Guptodhan - Your Trusted Marketplace',
      description: 'Buy, sell, and donate products securely.',
      images: [`${baseUrl}/og-image.png`],
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

    verification: {
      google: verificationCode,
    },

    alternates: {
      canonical: baseUrl,
      languages: {
        'en-US': `${baseUrl}/en`,
        'bn-BD': `${baseUrl}/bn`,
      },
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
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
        {integrations?.microsoftClarityEnabled &&
          integrations?.microsoftClarityId && (
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
        {integrations?.googleRecaptchaEnabled &&
          integrations?.recaptchaSiteKey && (
            <Script
              src={`https://www.google.com/recaptcha/api.js?render=${integrations.recaptchaSiteKey}`}
              strategy="beforeInteractive"
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
          <>
            <Script
              id="facebook-messenger-sdk"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.fbAsyncInit = function() {
                    FB.init({
                      xfbml: true,
                      version: 'v12.0'
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
          </>
        )}

        {/* Mobile App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#3B82F6" />

        {/* Additional SEO */}
        <meta name="author" content="Guptodhan" />
        <meta
          name="copyright"
          content="© 2024 Guptodhan. All rights reserved."
        />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
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

        {/* Facebook Messenger Chat Plugin */}
        {integrations?.messengerChatEnabled && integrations?.messengerLink && (
          <div
            className="fb-customerchat"
            data-page-id={integrations.messengerLink}
            data-attribution="setup_tool"
          />
        )}

        {/* ✅ SessionProviderWrapper wraps everything */}
        <SessionProviderWrapper>
          {/* ✅ AuthProvider wraps children - ADD THIS */}
          <AuthProvider>
            <PathnameDetector>
              {children}
              <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy="beforeInteractive"
              />
              <Toaster position="top-center" />
            </PathnameDetector>
          </AuthProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}