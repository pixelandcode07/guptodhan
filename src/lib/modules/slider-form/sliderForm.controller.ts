import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createPKSliderValidationSchema, updatePKSliderValidationSchema } from './sliderForm.validation';
import { SliderServices } from './sliderForm.service';
import dbConnect from '@/lib/db';

// Create a new slider
const createSlider = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createPKSliderValidationSchema.parse(body);

  const result = await SliderServices.createPKSliderInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Slider created successfully!',
    data: result,
  });
};

// Get all sliders
const getAllSliders = async () => {
  await dbConnect();
  const result = await SliderServices.getAllSlidersFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Sliders retrieved successfully!',
    data: result,
  });
};

// Get slider by ID
const getSliderById = async (req: NextRequest, context: { params: { id: string } } | Promise<{ params: { id: string } }>) => {
  await dbConnect();
  const { id } = (await context).params;
  const result = await SliderServices.getSliderByIdFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Slider retrieved successfully!',
    data: result,
  });
};

// Update slider
const updateSlider = async (req: NextRequest, context: { params: { id: string } } | Promise<{ params: { id: string } }>) => {
  await dbConnect();
  const { id } = (await context).params;
  const body = await req.json();
  const validatedData = updatePKSliderValidationSchema.parse(body);

  const result = await SliderServices.updateSliderInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Slider updated successfully!',
    data: result,
  });
};

// Delete slider
const deleteSlider = async (req: NextRequest, context: { params: { id: string } } | Promise<{ params: { id: string } }>) => {
  await dbConnect();
  const { id } = (await context).params;
  await SliderServices.deleteSliderFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Slider deleted successfully!',
    data: null,
  });
};

export const SliderController = {
  createSlider,
  getAllSliders,
  getSliderById,
  updateSlider,
  deleteSlider,
};
