import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createDeviceConditionValidationSchema, updateDeviceConditionValidationSchema } from '../validations/deviceCondition.validation';
import { DeviceConditionServices } from '../services/deviceCondition.service';
import { IDeviceCondition } from '../interfaces/deviceCondition.interface';
import dbConnect from '@/lib/db';

// Create a new device condition
const createDeviceCondition = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body = await req.json();
    const validatedData = createDeviceConditionValidationSchema.parse(body);

    const payload: Partial<IDeviceCondition> = {
      deviceCondition: validatedData.deviceCondition,
    };

    const result = await DeviceConditionServices.createDeviceConditionInDB(payload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Device condition created successfully!',
      data: result,
    });
  } catch (error) {
    console.error('Error creating device condition:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to create device condition',
      data: null,
    });
  }
};

// Get all device conditions
const getAllDeviceConditions = async () => {
  await dbConnect();
  const result = await DeviceConditionServices.getAllDeviceConditionsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Device conditions retrieved successfully!',
    data: result,
  });
};

// Update device condition
const updateDeviceCondition = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateDeviceConditionValidationSchema.parse(body);

  const payload: Partial<IDeviceCondition> = {};
  if (validatedData.deviceCondition) payload.deviceCondition = validatedData.deviceCondition;

  const result = await DeviceConditionServices.updateDeviceConditionInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Device condition updated successfully!',
    data: result,
  });
};

// Delete device condition
const deleteDeviceCondition = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  await DeviceConditionServices.deleteDeviceConditionFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Device condition deleted successfully!',
    data: null,
  });
};

export const DeviceConditionController = {
  createDeviceCondition,
  getAllDeviceConditions,
  updateDeviceCondition,
  deleteDeviceCondition,
};
