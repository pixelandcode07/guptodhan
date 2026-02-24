// =====================================================
// নতুন file বানাও:
// src/app/api/v1/product/[id]/raw/route.ts
// =====================================================

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import mongoose from 'mongoose';
=
// getProductLookupPipeline import করো তোমার service থেকে
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service';

const getRawProductById = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid product ID',
      data: null,
    });
  }

  // ✅ Raw data — ObjectId populate হবে না productOptions এ
  const result = await VendorProductServices.getVendorProductByIdFromDB(id);

  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Product not found!',
      data: null,
    });
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Raw product data retrieved successfully!',
    data: result,
  });
};

export const GET = catchAsync(getRawProductById);