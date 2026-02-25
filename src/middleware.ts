import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { StatusCodes } from 'http-status-codes';
import { jwtVerify } from 'jose';

// ✅ ১. Public Routes (যেখানে টোকেন লাগবে না)
const publicRoutes = [
  '/api/v1/auth/login',
  '/api/v1/user/register',
  '/api/v1/user/verify-otp',
  '/api/v1/otp/verify',
  '/api/v1/user/resend-otp',
  '/api/auth',
  '/api/v1/public',
];

// ❗️ Admin Routes
const adminRoutes = [
  '/general',
  '/api/v1/users',
  '/api/v1/donation-users',
  '/api/v1/donation-stats/dashboard',
  '/api/v1/classifieds-banners',
  '/api/v1/classifieds-subcategories',
  '/api/v1/brands',
  '/api/v1/classifieds-categories',
  '/api/v1/about',
  '/api/v1/service-categories',
  '/api/v1/service-subcategories',
  '/api/v1/settings',
  '/api/v1/footer-widgets',
  '/api/v1/social-links',
  '/api/v1/theme-settings',
  '/api/v1/seo-settings',
  '/api/v1/custom-code',
  '/api/v1/integrations',
  '/api/v1/donation-categories',
  '/api/v1/ecommerce-banners',
  '/api/v1/ecommerce-banners/[id]',
  '/api/v1/vendor-category/[id]',
  '/api/v1/vendors',
  '/api/v1/crm-modules/support-ticket',
  '/api/v1/slider-form',
  '/api/v1/slider-form/[id]',
  "/api/v1/donation-configs",
  '/api/v1/classifieds/ads/[id]',
  '/api/v1/social_links',
  '/api/v1/vendors/[id]',
  '/api/v1/shipping-policy',
  '/api/v1/ecommerce-category/ecomSubCategory', // Admin route for POST/PUT/DELETE
  '/api/v1/service-section/service-provider',
  '/api/v1/service-section/service-category',
  '/api/v1/service-section/service-banner',
  '/api/v1/service-section/provide-service/status/[id]',
  '/api/v1/service-section/provide-service/[id]',
  '/api/v1/faq-category',
  '/api/v1/faq',
];

// 🔥 Vendor Routes
const vendorRoutes = [
  '/dashboard',
  '/api/v1/vendor-store/dashboard',
  '/api/v1/vendor-store/storeWithProduct',
  '/api/v1/vendor-store/vendorId',
  '/api/v1/vendor-store/vendorProduct',
  '/api/v1/vendor-product',
  '/api/v1/vendor-orders',
  '/api/v1/withdrawal',
  '/api/v1/vendors',
  '/api/v1/vendor-store/store-with-product/[id]',
  '/v1/vendor-store/review',
  '/api/v1/vendor-store/vendorOrder'
];

// ❗️ Protected Routes
const protectedApiRoutes = [
  '/api/v1/job',
  '/api/v1/auth/change-password',
  '/api/v1/auth/vendor-change-password',
  '/api/otp/send-email',
  '/api/otp/verify-email',
  '/api/otp/verify-phone',
  '/api/v1/auth/set-password',
  '/api/v1/profile/me',
  '/api/v1/users', 
  '/api/v1/classifieds/ads',
  '/api/v1/classifieds/ads/[id]',
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
  '/api/v1/payment/init',
  '/api/v1/crm-modules/support-ticket',
  '/home/UserProfile/support-tickets',
  '/api/v1/vendor-category',
  '/api/v1/service-section/provide-service',
  '/api/v1/service-section/service-provider-manage/userId/[id]',
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ✅ ২. Public Route Check (সবার আগে চেক করবে)
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // 🛠️ Route type checks
  let isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isVendorRoute = vendorRoutes.some((route) => path.startsWith(route));
  const isProtectedApi = protectedApiRoutes.some((route) => path.startsWith(route));

  // 🔥 Professional Fix: Allow GET requests for Categories/Subcategories to bypass Admin strictness
  // যদি রিকোয়েস্টটি 'GET' হয়, তবে ভেন্ডররা বা ইউজাররা ক্যাটাগরিগুলো ফেচ করার এক্সেস পাবে।
  if (
    req.method === 'GET' && 
    (path.startsWith('/api/v1/ecommerce-category/ecomSubCategory') || 
     path.startsWith('/api/v1/ecommerce-category/ecomChildCategory') ||
     path.startsWith('/api/v1/vendor-category'))
  ) {
    isAdminRoute = false; 
  }

  // পাবলিক route → allow (যদি লিস্টে না থাকে এবং protected ও না হয়)
  if (!isAdminRoute && !isVendorRoute && !isProtectedApi) {
    return NextResponse.next();
  }

  let tokenPayload: any = null;
  let token = null;

  // ১. প্রথমে Header চেক করুন
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  // ২. যদি হেডার না থাকে, তাহলে Cookie চেক করুন
  else {
    token = req.cookies.get('accessToken')?.value || req.cookies.get('refreshToken')?.value;
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      tokenPayload = payload;
    } catch (err: any) {
      console.warn(`[Middleware] Token verification failed: ${err.message}`);
    }
  }

  // ৩. NextAuth Session চেক
  if (!tokenPayload) {
    const sessionToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (sessionToken) {
      tokenPayload = {
        userId: sessionToken.id,
        role: sessionToken.role,
      };
    }
  }

  // ❌ No Token Found
  if (!tokenPayload) {
    if (path.startsWith('/general') || path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.json(
      { success: false, message: 'Unauthorized: No valid token provided' },
      { status: StatusCodes.UNAUTHORIZED },
    );
  }

  // 🔹 Admin Check
  if (isAdminRoute && tokenPayload.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Forbidden: You do not have permission (Admin only).' },
      { status: StatusCodes.FORBIDDEN },
    );
  }

  // 🔥 Vendor Check
  if (isVendorRoute && tokenPayload.role !== 'vendor' && !isAdminRoute) {
    if (path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.json(
      { success: false, message: 'Forbidden: You do not have permission (Vendor only).' },
      { status: StatusCodes.FORBIDDEN },
    );
  }

  // ✅ Attach headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', tokenPayload.userId || tokenPayload.id);
  requestHeaders.set('x-user-role', tokenPayload.role);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/api/:path*', '/general/:path*', '/dashboard/:path*'],
};