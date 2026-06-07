// src/lib/modules/product-config/controllers/productCountry.controller.ts

import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { sendResponse } from '@/lib/utils/sendResponse';

import dbConnect from '@/lib/db';
import { createProductCountrySchema, updateProductCountrySchema } from './productCountry.validation';
import { ProductCountryService } from './productCountry.service';

// ===========================
// POST - Create Country
// ===========================
const createCountry = async (req: NextRequest) => {
  try {
    await dbConnect();
    const body = await req.json();
    const validated = createProductCountrySchema.parse(body);
    const result = await ProductCountryService.createCountryInDB(validated);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Country created successfully!',
      data: result,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: err.issues.map((i) => i.message).join('; '),
        data: err.issues,
      });
    }
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err instanceof Error ? err.message : 'Something went wrong.',
      data: null,
    });
  }
};

// ===========================
// GET ALL - List Countries
// ===========================
const getAllCountries = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  
  // ?active=true দিলে শুধু active country আসবে (product form dropdown এর জন্য)
  const onlyActive = searchParams.get('active') === 'true';
  
  const result = await ProductCountryService.getAllCountriesFromDB(onlyActive);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Countries retrieved successfully!',
    data: result,
  });
};

// ===========================
// GET ONE - By ID
// ===========================
const getCountryById = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const result = await ProductCountryService.getCountryByIdFromDB(id);

  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Country not found!',
      data: null,
    });
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Country retrieved successfully!',
    data: result,
  });
};

// ===========================
// PATCH - Update Country
// ===========================
const updateCountry = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const validated = updateProductCountrySchema.parse(body);

    const result = await ProductCountryService.updateCountryInDB(id, validated);

    if (!result) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Country not found!',
        data: null,
      });
    }

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Country updated successfully!',
      data: result,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: err.issues.map((i) => i.message).join('; '),
        data: err.issues,
      });
    }
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err instanceof Error ? err.message : 'Something went wrong.',
      data: null,
    });
  }
};

// ===========================
// DELETE - Remove Country
// ===========================
const deleteCountry = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const result = await ProductCountryService.deleteCountryFromDB(id);

  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Country not found!',
      data: null,
    });
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Country deleted successfully!',
    data: result,
  });
};

export const ProductCountryController = {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
};