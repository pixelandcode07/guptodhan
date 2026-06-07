import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import dbConnect from '@/lib/db';
import { createProductCountrySchema, updateProductCountrySchema } from './productCountry.validation';
import { ProductCountryService } from './productCountry.service';

// ─── Helper: multipart form parse ────────────────────────────────────────────
const parseFormData = async (req: NextRequest) => {
  const formData = await req.formData();

  // Convert null to undefined to prevent Zod errors
  const name   = (formData.get('name') as string) || undefined;
  const code   = (formData.get('code') as string) || undefined;
  const status = (formData.get('status') as string) || undefined;

  // Flag file processing
  const flagEntry  = formData.get('flag');
  let flagFile: { buffer: Buffer; mimeType: string } | undefined;

  if (flagEntry && typeof flagEntry === 'object' && 'arrayBuffer' in flagEntry) {
    const file = flagEntry as File;
    if (file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      flagFile = {
        buffer:   Buffer.from(arrayBuffer),
        mimeType: file.type,
      };
    }
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

    const validated = createProductCountrySchema.parse({ name, code, status });

    const result = await ProductCountryService.createCountryInDB(validated, flagFile);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Country created successfully!',
      data: result,
    });
  } catch (err: any) {
    console.error("❌ Country Create Error:", err);
    
    if (err.name === 'ZodError' || err.issues) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: err.issues?.map((i: any) => i.message).join('; ') || 'Validation error',
        data: err.issues,
      });
    }

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err?.message || 'Something went wrong.',
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

    const updatePayload: any = {};
    if (name) updatePayload.name = name;
    if (code) updatePayload.code = code;
    if (status) updatePayload.status = status;

    const validated = updateProductCountrySchema.parse(updatePayload);

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
  } catch (err: any) {
    console.error("❌ Country Update Error:", err);

    if (err.name === 'ZodError' || err.issues) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: err.issues?.map((i: any) => i.message).join('; ') || 'Validation error',
        data: err.issues,
      });
    }

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err?.message || 'Something went wrong.',
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