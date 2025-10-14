import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import {
  createUpazilaThanaValidationSchema,
  updateUpazilaThanaValidationSchema,
} from './uppazilaThana.validation';
import { UpazilaThanaServices } from './uppazilaThana.service';
import dbConnect from '@/lib/db';
import { IUpazilaThana } from './upazilaThana.interface';

// Create a new Upazila/Thana
const createUpazilaThana = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createUpazilaThanaValidationSchema.parse(body);

  const payload: Partial<IUpazilaThana> = {
    ...validatedData,
  } as Partial<IUpazilaThana>;

  const result = await UpazilaThanaServices.createUpazilaThanaInDB(payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Upazila/Thana created successfully!',
    data: result,
  });
};

// Get all Upazilas/Thanas
const getAllUpazilaThanas = async () => {
  await dbConnect();
  const result = await UpazilaThanaServices.getAllUpazilaThanasFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All Upazilas/Thanas retrieved successfully!',
    data: result,
  });
};

// Get Upazilas/Thanas by district
const getUpazilaThanasByDistrict = async (
  _req: NextRequest,
  { params }: { params: Promise<{ district: string }> }
) => {
  await dbConnect();
  const { district } = await params;
  const result = await UpazilaThanaServices.getUpazilaThanasByDistrictFromDB(district);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: `Upazilas/Thanas in ${district} retrieved successfully!`,
    data: result,
  });
};

// Update Upazila/Thana
const updateUpazilaThana = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateUpazilaThanaValidationSchema.parse(body);

  const payload: Partial<IUpazilaThana> = { ...validatedData } as Partial<IUpazilaThana>;

  const result = await UpazilaThanaServices.updateUpazilaThanaInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Upazila/Thana updated successfully!',
    data: result,
  });
};

// Delete Upazila/Thana
const deleteUpazilaThana = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  await UpazilaThanaServices.deleteUpazilaThanaFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Upazila/Thana deleted successfully!',
    data: null,
  });
};

export const UpazilaThanaController = {
  createUpazilaThana,
  getAllUpazilaThanas,
  getUpazilaThanasByDistrict,
  updateUpazilaThana,
  deleteUpazilaThana,
};
