// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\utils\sendResponse.ts

import { NextResponse } from 'next/server';

interface TMeta {
  page: number;
  limit: number;
  total: number;
}

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: TMeta;
  data: T | null; // Data can be null for logout/change-password
}

export const sendResponse = <T>(data: TResponse<T>): NextResponse => {
  return NextResponse.json(
    {
      success: data.success,
      message: data.message,
      meta: data.meta,
      data: data.data,
    },
    { status: data.statusCode },
  );
};