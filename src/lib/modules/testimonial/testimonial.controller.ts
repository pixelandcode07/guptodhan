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
import { ITestimonial } from './testimonial.interface';

// Create a new testimonial
const createTestimonial = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createTestimonialValidationSchema.parse(body);

  // ✅ Explicitly cast productID to ObjectId only, remove string possibility
  const payload: Partial<ITestimonial> = {
    ...validatedData,
    productID: new Types.ObjectId(validatedData.productID),
  } as Partial<ITestimonial>;

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
    message: 'All testimonials retrieved successfully!',
    data: result,
  });
};

// Get public testimonials
const getPublicTestimonials = async () => {
  await dbConnect();
  const result = await TestimonialServices.getPublicTestimonialsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Public testimonials retrieved successfully!',
    data: result,
  });
};

// Update testimonial
const updateTestimonial = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateTestimonialValidationSchema.parse(body);

  // ✅ Safe handling of optional productID
  const payload: Partial<ITestimonial> = {
    ...validatedData,
    ...(validatedData.productID
      ? { productID: new Types.ObjectId(validatedData.productID) }
      : {}),
  } as Partial<ITestimonial>;

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
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
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
  getPublicTestimonials,
  updateTestimonial,
  deleteTestimonial,
};
