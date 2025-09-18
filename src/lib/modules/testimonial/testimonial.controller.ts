import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import {
  createTestimonialValidationSchema,
  updateTestimonialValidationSchema,
} from './testimonial.validation';
import { TestimonialServices } from './testimonial.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

// Create a new testimonial
const createTestimonial = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createTestimonialValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    productID: new Types.ObjectId(validatedData.productID),
  };

  const result = await TestimonialServices.createTestimonialInDB(payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Testimonial created successfully!',
    data: result,
  });
};

// Get all testimonials
const getAllTestimonials = async () => {
  await dbConnect();
  const result = await TestimonialServices.getAllTestimonialsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Testimonials retrieved successfully!',
    data: result,
  });
};

// Get testimonials by product
const getTestimonialsByProduct = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  await dbConnect();
  const { productId } = params;
  const result = await TestimonialServices.getTestimonialsByProductFromDB(productId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Testimonials retrieved successfully!',
    data: result,
  });
};

// Update testimonial
const updateTestimonial = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateTestimonialValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    ...(validatedData.productID && { productID: new Types.ObjectId(validatedData.productID) }),
  };

  const result = await TestimonialServices.updateTestimonialInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Testimonial updated successfully!',
    data: result,
  });
};

// Delete testimonial
const deleteTestimonial = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;
  await TestimonialServices.deleteTestimonialFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Testimonial deleted successfully!',
    data: null,
  });
};

export const TestimonialController = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialsByProduct,
  updateTestimonial,
  deleteTestimonial,
};
