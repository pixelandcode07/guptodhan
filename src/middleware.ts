import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { StatusCodes } from "http-status-codes";

const adminRoutes = ["/general", "/api/v1/users"];
const protectedApiRoutes = ["/api/v1/profile/me", "/api/v1/orders"];

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
