
import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from './lib/utils/jwt';

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
    '/api/v1/conversations'

];


export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

    if (isProtectedRoute) {
        const authHeader = req.headers.get('authorization');
        console.log('--- 🔹 Authorization Header ---', authHeader);


        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: No token provided or malformed header' },
                { status: StatusCodes.UNAUTHORIZED }
            );
        }

        const token = authHeader.split(' ')[1];
        console.log('--- 🔹 Token extracted ---', token);


        try {
            const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
            console.log('--- 🔑 Secret used for VERIFYING token ---:', decoded);

            const requestHeaders = new Headers(req.headers);
            requestHeaders.set('x-user-id', decoded.userId as string);
            requestHeaders.set('x-user-email', decoded.email as string);
            requestHeaders.set('x-user-role', decoded.role as string);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });

        } catch (error) {
            if (error instanceof Error && error.name === 'TokenExpiredError') {
                return NextResponse.json(
                    { success: false, message: 'Unauthorized: Token has expired' },
                    { status: StatusCodes.UNAUTHORIZED }
                );
            }
            return NextResponse.json(
                { success: false, message: 'Unauthorized: Invalid token' },
                { status: StatusCodes.UNAUTHORIZED }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*'],
    runtime: 'nodejs',
};