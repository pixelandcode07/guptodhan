import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createDeliveryChargeValidationSchema, updateDeliveryChargeValidationSchema } from './deliveryCharge.validation';
import { DeliveryChargeServices } from './deliveryCharge.service';
import dbConnect from '@/lib/db';

// ✅ Bulk Create Delivery Charges
const createDeliveryCharges = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();

  if (!Array.isArray(body) || body.length === 0) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Please provide an array of delivery charges for bulk upload.',
      data: null,
    });
  }

  // Validate each delivery charge item using Zod
  const validatedData = body.map((item) =>
    createDeliveryChargeValidationSchema.parse(item)
  );

  const result = await DeliveryChargeServices.createDeliveryChargeInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Delivery charges uploaded successfully!',
    data: result,
  });
};

// ✅ Get All Delivery Charges (optional filter by division/district)
const getAllDeliveryCharges = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const filters = {
    divisionName: searchParams.get('divisionName') || undefined,
    districtName: searchParams.get('districtName') || undefined,
  };

  const result = await DeliveryChargeServices.getAllDeliveryChargesFromDB(filters);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Delivery charges retrieved successfully!',
    data: result,
  });
};

// ✅ Get Delivery Charges by Division
const getDeliveryChargesByDivision = async (
  _req: NextRequest,
  context: any // ✅ Changed to any/context to handle Next.js Promise params
) => {
  await dbConnect();
  const params = await context.params; // ✅ Await is mandatory in Next.js 15+
  const { divisionName } = params;

  const result = await DeliveryChargeServices.getDeliveryChargesByDivisionFromDB(divisionName);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Delivery charges retrieved successfully by division!',
    data: result,
  });
};

// ✅ Update Delivery Charge by ID
const updateDeliveryCharge = async (
  req: NextRequest,
  context: any // ✅ Changed to handle Promise params
) => {
  await dbConnect();
  const params = await context.params; // ✅ Await is mandatory in Next.js 15+
  const { id } = params;
  const body = await req.json();

  const validatedData = updateDeliveryChargeValidationSchema.parse(body);

  const result = await DeliveryChargeServices.updateDeliveryChargeInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Delivery charge updated successfully!',
    data: result,
  });
};

// ✅ Delete Delivery Charge by ID
const deleteDeliveryCharge = async (
  _req: NextRequest,
  context: any // ✅ Changed to handle Promise params
) => {
  await dbConnect();
  const params = await context.params; // ✅ Await is mandatory in Next.js 15+
  const { id } = params;

  await DeliveryChargeServices.deleteDeliveryChargeFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Delivery charge deleted successfully!',
    data: null,
  });
};

export const DeliveryChargeController = {
  createDeliveryCharges,
  getAllDeliveryCharges,
  getDeliveryChargesByDivision,
  updateDeliveryCharge,
  deleteDeliveryCharge,
};