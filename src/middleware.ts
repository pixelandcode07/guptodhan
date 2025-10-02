import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { StatusCodes } from "http-status-codes";

const adminRoutes = ["/general", "/api/v1/users"];
const protectedApiRoutes = ['/api/v1/auth/change-password',
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
    '/api/v1/seo-settings',
    '/api/v1/custom-code',
    '/api/v1/integrations',
    '/api/v1/services',
    '/api/v1/donation-categories',
    '/api/v1/donation-campaigns'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isProtectedApi = protectedApiRoutes.some((route) =>
    path.startsWith(route)
  );

  // যদি public route হয় → allow
  if (!isAdminRoute && !isProtectedApi) {
    return NextResponse.next();
  }

  // ✅ cookie থেকে token পড়া
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ✅ যদি token না থাকে → সবসময় login এ পাঠাবে
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ admin check
  if (isAdminRoute && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ headers এ user info forward করা
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", token.id as string);
  requestHeaders.set("x-user-role", token.role as string);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/api/:path*", "/general/:path*"],
};
