/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

export type TUserRole = 'user' | 'vendor' | 'admin' | 'service-provider';
type TControllerFunction = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

export const checkRole = (allowedRoles: TUserRole[]) => {
  return (handler: TControllerFunction) => {
    return async (req: NextRequest, ...args: any[]) => {
      const userRole = req.headers.get('x-user-role') as TUserRole;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return NextResponse.json(
          { success: false, message: 'Forbidden: You do not have permission to perform this action.' },
          { status: StatusCodes.FORBIDDEN }
        );
      }
      
      return handler(req, ...args);
    };
  };
};