import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createPKSliderValidationSchema, updatePKSliderValidationSchema } from './sliderForm.validation';
import { reorderSlidersService, SliderServices } from './sliderForm.service';
import dbConnect from '@/lib/db';

/**
 * স্লাইডার ডাটা প্রসেসিং হেল্পার ফাংশন
 * এটি বডি থেকে আসা টাইপ অনুযায়ী actionStatus এবং IDs সেট করে দেয়
 */
const processAppNavigation = (body: any) => {
  const type = body.appRedirectType;
  const targetId = body.appRedirectId;

  const data = {
    ...body,
    actionStatus: 'none',
    productId: null,
    category: null,
    store: null,
  };

  if (type === 'Product') {
    data.actionStatus = 'product';
    data.productId = targetId;
  } else if (type === 'Category') {
    data.actionStatus = 'category';
    data.category = targetId;
  } else if (type === 'Shop') {
    data.actionStatus = 'store';
    data.store = targetId;
  }

  return data;
};

// ১. Create a new slider
const createSlider = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();

  // অ্যাপ ডাটা প্রসেস করা
  const processedData = processAppNavigation(body);

  // ভ্যালিডেশন
  const validatedData = createPKSliderValidationSchema.parse(processedData);

  // ডাটাবেসে সেভ
  const result = await SliderServices.createPKSliderInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Slider created successfully!',
    data: result,
  });
};

// ২. Get all sliders
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

// ৩. Get slider by ID (FIXED Context Type)
const getSliderById = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await context.params;
  const result = await SliderServices.getSliderByIdFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Slider retrieved successfully!',
    data: result,
  });
};

// ৪. Update slider (FIXED Context Type & Logic)
const updateSlider = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await context.params;
  const body = await req.json();

  // যদি বডিতে appRedirectType থাকে তবেই নেভিগেশন প্রসেস করবে
  const processedData = body.appRedirectType ? processAppNavigation(body) : body;

  const validatedData = updatePKSliderValidationSchema.parse(processedData);
  const result = await SliderServices.updateSliderInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Slider updated successfully!',
    data: result,
  });
};

// ৫. Delete slider (FIXED Context Type)
const deleteSlider = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await context.params;
  await SliderServices.deleteSliderFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Slider deleted successfully!',
    data: null,
  });
};

// ৬. Reorder sliders (drag-and-drop)
const reorderSliders = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const { orderedIds } = body;

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid request: "orderedIds" must be a non-empty array.',
      data: null,
    });
  }

  const result = await reorderSlidersService(orderedIds);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message || 'Sliders reordered successfully!',
    data: null,
  });
};

export const SliderController = {
  createSlider,
  getAllSliders,
  getSliderById,
  updateSlider,
  deleteSlider,
  reorderSliders,
};