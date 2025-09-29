
import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from './lib/utils/jwt';


const adminRoutes = [
    '/general',
];

const protectedRoutes = [
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
    '/api/v1/seo-settings',
    '/api/v1/custom-code',
    '/api/v1/integrations',
    '/api/v1/services',
    '/api/v1/donation-categories',
    '/api/v1/donation-campaigns'
    
];


export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
    const isProtectedApi = protectedApiRoutes.some(route => path.startsWith(route));

    // If the route is not protected in any way, continue
    if (!isAdminRoute && !isProtectedApi) {
        return NextResponse.next();
    }

    // --- Token Verification Logic (for all protected and admin routes) ---
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // For page routes, redirect to login. For API routes, return JSON error.
        if (path.startsWith('/general')) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        return NextResponse.json(
            { success: false, message: 'Unauthorized: No token provided' },
            { status: StatusCodes.UNAUTHORIZED }
        );
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
        
        // --- Role Verification for Admin Routes ---
        if (isAdminRoute && decoded.role !== 'admin') {
            // For admin pages, redirect to home. For API routes, return JSON error.
             if (path.startsWith('/general')) {
                return NextResponse.redirect(new URL('/', req.url));
            }
            return NextResponse.json(
                { success: false, message: 'Forbidden: You do not have permission to perform this action.' },
                { status: StatusCodes.FORBIDDEN }
            );
        }

        // Add user data to the request headers for backend API routes to use
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', decoded.userId as string);
        requestHeaders.set('x-user-role', decoded.role as string);

        return NextResponse.next({
            request: { headers: requestHeaders },
        });

    } catch (error) {
        // Handle expired or invalid tokens
        const message = error instanceof Error && error.name === 'TokenExpiredError'
            ? 'Unauthorized: Token has expired'
            : 'Unauthorized: Invalid token';

        // Redirect to login page for expired page sessions
        if (path.startsWith('/general')) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Return JSON error for API calls
        return NextResponse.json(
            { success: false, message },
            { status: StatusCodes.UNAUTHORIZED }
        );
    }
}

export const config = {
    matcher: ['/api/:path*', '/general/:path*'],
    runtime: 'nodejs',
};