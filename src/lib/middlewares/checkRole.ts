/* eslint-disable @typescript-eslint/no-explicit-any */
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\middlewares\checkRole.ts

import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

type TUserRole = 'user' | 'vendor' | 'admin';
type TControllerFunction = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

// এটি একটি হায়ার-অর্ডার ফাংশন যা একটি কন্ট্রোলারকে 감싸 রাখে
export const checkRole = (allowedRoles: TUserRole[]) => {
  return (handler: TControllerFunction) => {
    return async (req: NextRequest, ...args: any[]) => {
      // মূল middleware.ts থেকে পাঠানো রোলটি এখানে গ্রহণ করা হচ্ছে
      const userRole = req.headers.get('x-user-role') as TUserRole;

      if (!userRole || !allowedRoles.includes(userRole)) {
        // যদি ইউজারের রোল অনুমতিপ্রাপ্ত রোলের তালিকায় না থাকে
        return NextResponse.json(
          { success: false, message: 'Forbidden: You do not have permission to perform this action.' },
          { status: StatusCodes.FORBIDDEN }
        );
      }
      
      // যদি রোল মিলে যায়, তাহলে মূল কন্ট্রোলার ফাংশনটিকে কল করা হবে
      return handler(req, ...args);
    };
  };
};