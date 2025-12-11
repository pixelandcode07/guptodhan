import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { StatusCodes } from 'http-status-codes';
import { jwtVerify } from 'jose';

// ❗️ Admin Routes (আপনার আগের লিস্ট)
const adminRoutes = [
  '/general',
  '/api/v1/users',
  '/api/v1/classifieds-banners',
  // '/api/v1/reports',
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
  '/api/v1/theme-settings',
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
];

// 🔥 Vendor Routes (নতুন যোগ করা হয়েছে)
const vendorRoutes = [
  '/dashboard', // Vendor Dashboard Frontend
  '/api/v1/vendor-store',
  '/api/v1/vendor-product',
  '/api/v1/vendor-orders',
  '/api/v1/withdrawal',
  '/api/v1/vendors',
];

// ❗️ Protected Routes (Logged in users - আপনার আগের লিস্ট)
const protectedApiRoutes = [
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
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
 
  // ১. রুট চেক করা
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isVendorRoute = vendorRoutes.some((route) => path.startsWith(route)); // 🔥 Vendor Check
  const isProtectedApi = protectedApiRoutes.some((route) => path.startsWith(route));

  // পাবলিক route → allow
  if (!isAdminRoute && !isVendorRoute && !isProtectedApi) {
    return NextResponse.next();
  }

  let tokenPayload: any = null;

  // 🔹 Try Bearer Token first
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const rawToken = authHeader.split(' ')[1];
    try {
      const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
      const { payload } = await jwtVerify(rawToken, secret);
      tokenPayload = payload;
      // console.log('✅ Verified via Bearer token:', tokenPayload);
    } catch (err: any) {
      console.warn(`[Middleware] Bearer token invalid or expired: ${err.code || err.message}`);
    }
  }

  // 🔹 Try NextAuth Session Token if no (or expired) Bearer
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
      console.log('✅ Using NextAuth session token:', tokenPayload);
      console.log('✅ session token:', sessionToken);
    }
  }

  // ❌ No Token Found (না Bearer, না NextAuth সেশন)
  if (!tokenPayload) {
    // যদি অ্যাডমিন প্যানেল বা ভেন্ডর ড্যাশবোর্ডে ঢোকার চেষ্টা করে, লগইন পেজে পাঠাও
    if (path.startsWith('/general') || path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // API হলে JSON এরর দাও
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

  // 🔥 Vendor Check (নতুন লজিক)
  if (isVendorRoute && tokenPayload.role !== 'vendor') {
    // যদি ড্যাশবোর্ডে এক্সেস করার চেষ্টা করে কিন্তু ভেন্ডর না হয়
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
  // 🔥 '/dashboard/:path*' এখানে যোগ করা হয়েছে
  matcher: ['/api/:path*', '/general/:path*', '/dashboard/:path*'],
};