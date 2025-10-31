import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { StatusCodes } from 'http-status-codes';

// ✅ FIX: রুটগুলো সঠিকভাবে ভাগ করা হয়েছে
// শুধুমাত্র অ্যাডমিনদের জন্য পেজ এবং API রুট
const adminRoutes = [
    "/general",
    "/api/v1/users",
    "/api/v1/classifieds-banners",
    "/api/v1/reports",
    "/api/v1/classifieds-subcategories",
    "/api/v1/brands",
    "/api/v1/classifieds-categories",
    "/api/v1/about",
    "/api/v1/service-categories",
    "/api/v1/service-subcategories",
    "/api/v1/settings",
    "/api/v1/footer-widgets",
    "/api/v1/social-links",
    "/api/v1/theme-settings",
    "/api/v1/seo-settings",
    "/api/v1/custom-code",
    "/api/v1/integrations",
    "/api/v1/donation-categories",
    "/api/v1/theme-settings",
    "/app/api/v1/donation-categories/[id]",
   
];

// যেকোনো লগইন করা ইউজারের জন্য সুরক্ষিত API রুট
const protectedApiRoutes = [
    '/api/v1/auth/change-password',
    '/api/otp/send-email',
    '/api/otp/verify-email',
    '/api/otp/verify-phone',
    '/api/v1/auth/set-password',
    '/api/v1/profile/me',
    '/api/v1/users',
    '/api/v1/classifieds/ads',
    '/api/v1/classifieds-banners',
    '/api/v1/reports',
    '/api/v1/classifieds-subcategories',
    '/api/v1/brands',
    '/api/v1/classifieds-categories',
    '/api/v1/about',
    '/api/v1/conversations',
    '/api/v1/service-categories',
    '/api/v1/service-subcategories',
    '/api/v1/settings',
    '/api/v1/footer-widgets',
    '/api/v1/social-links',
    '/api/v1/theme-settings',
    '/api/v1/custom-code',
    '/api/v1/integrations',
    '/api/v1/services',
    '/api/v1/donation-categories',
    '/api/v1/donation-campaigns',
    '/api/v1/product-order',
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  const isProtectedApi = protectedApiRoutes.some(route =>
    path.startsWith(route)
  );

  if (!isAdminRoute && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ✅ FIX: টোকেন না থাকলে API-এর জন্য 401 JSON error পাঠানো হচ্ছে
  if (!token) {
    if (path.startsWith('/general')) {
      // পেজের জন্য রিডাইরেক্ট
      return NextResponse.redirect(new URL('/', req.url));
    }
    // API-এর জন্য JSON error
    return NextResponse.json(
      { success: false, message: 'Unauthorized: No token provided' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  // অ্যাডমিন রোল চেক
  if (isAdminRoute && token.role !== 'admin') {
    if (path.startsWith('/general')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.json(
      { success: false, message: 'Forbidden: You do not have permission.' },
      { status: StatusCodes.FORBIDDEN }
    );
  }

  // হেডারে ইউজার তথ্য যোগ করা
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', token.id as string);
  requestHeaders.set('x-user-role', token.role as string);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/api/:path*', '/general/:path*'],
};
