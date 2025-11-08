import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { StatusCodes } from 'http-status-codes';
import { jwtVerify } from 'jose';
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
  "/api/v1/profile/me",
  "/api/v1/ecommerce-banners",
  "/api/v1/ecommerce-banners/[id]",
  "/api/v1/vendor-category",
  "/api/v1/vendor-category/[id]"
];

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
  '/api/v1/wishlist',
  '/api/v1/add-to-cart',
  '/api/v1/payment/init'
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  const isProtectedApi = protectedApiRoutes.some(route => path.startsWith(route));

  // পাবলিক route → allow
  if (!isAdminRoute && !isProtectedApi) return NextResponse.next();

  let tokenPayload: any = null;

  // 🔹 Try Bearer Token first
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const rawToken = authHeader.split(' ')[1];
    try {
      const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
      const { payload } = await jwtVerify(rawToken, secret);
      tokenPayload = payload;
      console.log('✅ Verified via Bearer token:', tokenPayload);
    } catch (err) {
      console.error('❌ Invalid JWT from header:', err);
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Invalid or expired token' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }
  }

  // 🔹 Try NextAuth Session Token if no Bearer
  if (!tokenPayload) {
    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (sessionToken) {
      tokenPayload = {
        userId: sessionToken.id,
        role: sessionToken.role,
      };
      console.log('✅ Using NextAuth session token:', tokenPayload);
    }
  }

  // ❌ No Token Found
  if (!tokenPayload) {
    if (path.startsWith('/general')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.json(
      { success: false, message: 'Unauthorized: No token provided' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  // 🔹 Admin Check
  if (isAdminRoute && tokenPayload.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Forbidden: You do not have permission.' },
      { status: StatusCodes.FORBIDDEN }
    );
  }

  // ✅ Attach headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', tokenPayload.userId || tokenPayload.id);
  requestHeaders.set('x-user-role', tokenPayload.role);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/api/:path*', '/general/:path*'],
};
