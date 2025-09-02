// ফাইল পাথ: src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from './lib/utils/jwt';

// যে রুটগুলোকে আপনি সুরক্ষিত করতে চান, সেগুলোর তালিকা
// এই রুটগুলোতে রিকোয়েস্ট পাঠাতে হলে অবশ্যই একটি ভ্যালিড accessToken লাগবে
const protectedRoutes = [
    '/api/auth/change-password',
    '/api/otp/send-email',     
    '/api/otp/verify-email',  
    '/api/otp/verify-phone' 
    
];

/**
 * @description এই মিডলওয়্যারটি প্রতিটি API রিকোয়েস্টের আগে রান হবে
 */
export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

    // ধাপ ১: রুটটি সুরক্ষিত কিনা তা চেক করা হচ্ছে
    if (isProtectedRoute) {
        // ধাপ ২: 'Authorization' হেডার থেকে টোকেন বের করা হচ্ছে
        const authHeader = req.headers.get('authorization');
        console.log('--- 🔹 Authorization Header ---', authHeader);

        
        // হেডারটি 'Bearer <token>' ফরম্যাটে আছে কিনা তা চেক করা হচ্ছে
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: No token provided or malformed header' },
                { status: StatusCodes.UNAUTHORIZED }
            );
        }
        
        const token = authHeader.split(' ')[1];
        console.log('--- 🔹 Token extracted ---', token);


        try {
            // ধাপ ৩: টোকেনটি ভেরিফাই করা হচ্ছে
            const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
            console.log('--- 🔑 Secret used for VERIFYING token ---:', decoded);
            
            // ধাপ ৪: টোকেন ভ্যালিড হলে, রিকোয়েস্টের হেডারে ইউজারের তথ্য যোগ করে দেওয়া হচ্ছে
            const requestHeaders = new Headers(req.headers);
            requestHeaders.set('x-user-id', decoded.userId as string);
            requestHeaders.set('x-user-email', decoded.email as string);
            requestHeaders.set('x-user-role', decoded.role as string);

            // নতুন হেডারসহ রিকোয়েস্টটিকে কন্ট্রোলারের দিকে এগিয়ে দেওয়া হচ্ছে
            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });

        } catch (error) {
            // টোকেনের মেয়াদ শেষ হলে বা টোকেনটি অবৈধ হলে এই এররটি আসবে
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

    // যদি রুটটি সুরক্ষিত না হয়, তাহলে রিকোয়েস্টটিকে সরাসরি যেতে দেওয়া হচ্ছে
    return NextResponse.next();
}

// কনফিগারেশন: কোন কোন রুটে এই মিডলওয়্যারটি চলবে তা নির্ধারণ করা
export const config = {
    matcher: ['/api/:path*'],
    runtime: 'nodejs',
};