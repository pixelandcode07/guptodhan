import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createProductQAValidationSchema, updateProductQAValidationSchema } from './productQNA.validation';
import { ProductQAService } from './productQNA.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

//Create a new question
const createProductQA = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createProductQAValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    productId: new Types.ObjectId(validatedData.productId),
    userId: new Types.ObjectId(validatedData.userId),
  };

  const result = await ProductQAService.createProductQAInDB(payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Product question created successfully!',
    data: result,
  });
};

//Get all product Q&A
const getAllProductQA = async () => {
  await dbConnect();
  const result = await ProductQAService.getAllProductQAFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All product Q&A retrieved successfully!',
    data: result,
  });
};

//Get Q&A by product
const getProductQAByProduct = async (
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) => {
  await dbConnect();
  const { productId } = await params;
  const result = await ProductQAService.getProductQAByProductFromDB(productId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product Q&A retrieved successfully!',
    data: result,
  });
};

//Get questions by user
const getProductQAByUser = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  await dbConnect();
  const { userId } = await params;
  const result = await ProductQAService.getProductQAByUserFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User questions retrieved successfully!',
    data: result,
  });
};

//Admin updates question with answer
const updateProductQA = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } =await params;
  console.log(id);
  const body = await req.json();
  const validatedData = updateProductQAValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    ...(validatedData.productId && { productId: new Types.ObjectId(validatedData.productId) }),
    ...(validatedData.userId && { userId: new Types.ObjectId(validatedData.userId) }),
  };

  const result = await ProductQAService.updateProductQAWithAnswerInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product question updated successfully!',
    data: result,
  });
};

//Delete a question (and answer if exists)
const deleteProductQA = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  await ProductQAService.deleteProductQAFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product question deleted successfully!',
    data: null,
  });
};

export const ProductQAController = {
  createProductQA,
  getAllProductQA,
  getProductQAByProduct,
  getProductQAByUser,
  updateProductQA,
  deleteProductQA,
};
