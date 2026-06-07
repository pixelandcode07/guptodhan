// src/lib/modules/product-config/controllers/productCountry.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { sendResponse } from '@/lib/utils/sendResponse';
import dbConnect from '@/lib/db';
import { createProductCountrySchema, updateProductCountrySchema } from './productCountry.validation';
import { ProductCountryService } from './productCountry.service';

// ─── Helper: multipart form parse ────────────────────────────────────────────
// req.formData() দিয়ে fields আর file একসাথে নেওয়া হচ্ছে
const parseFormData = async (req: NextRequest) => {
  const formData = await req.formData();

  // Text fields
  const name       = formData.get('name') as string | null;
  const code       = formData.get('code') as string | null;
  const status     = formData.get('status') as string | null;

  // Flag file (optional)
  const flagEntry  = formData.get('flag');
  let flagFile: { buffer: Buffer; mimeType: string } | undefined;

  if (flagEntry && flagEntry instanceof File && flagEntry.size > 0) {
    const arrayBuffer = await flagEntry.arrayBuffer();
    flagFile = {
      buffer:   Buffer.from(arrayBuffer),
      mimeType: flagEntry.type,
    };
  }

  return { name, code, status, flagFile };
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

// ── POST  /api/v1/product-config/country ─────────────────────────────────────
const createCountry = async (req: NextRequest) => {
  try {
    await dbConnect();
    const { name, code, status, flagFile } = await parseFormData(req);

    // Zod validation — text fields only
    const validated = createProductCountrySchema.parse({ name, code, status });

    const result = await ProductCountryService.createCountryInDB(validated, flagFile);

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

// ── GET  /api/v1/product-config/country ──────────────────────────────────────
const getAllCountries = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const onlyActive = searchParams.get('active') === 'true';
  const result = await ProductCountryService.getAllCountriesFromDB(onlyActive);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Countries retrieved successfully!',
    data: result,
  });
};

// ── GET  /api/v1/product-config/country/:id ──────────────────────────────────
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

// ── PATCH  /api/v1/product-config/country/:id ────────────────────────────────
const updateCountry = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await dbConnect();
    const { id } = await params;
    const { name, code, status, flagFile } = await parseFormData(req);

    // Zod — text fields only, all optional for update
    const validated = updateProductCountrySchema.parse({
      ...(name   && { name }),
      ...(code   && { code }),
      ...(status && { status }),
    });

    const result = await ProductCountryService.updateCountryInDB(id, validated, flagFile);

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

// ── DELETE  /api/v1/product-config/country/:id ───────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════════
export const ProductCountryController = {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
};