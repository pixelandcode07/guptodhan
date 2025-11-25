/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

type TControllerFunction = (req: NextRequest, context?: any) => Promise<NextResponse>;

export const catchAsync = (fn: TControllerFunction) => {
  return async (req: NextRequest, context?: any) => {
    try {
      return await fn(req, context);
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Something went wrong!",
        },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }
  };
};