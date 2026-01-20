import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createProductQAValidationSchema, updateProductQAValidationSchema } from './productQNA.validation';
import { ProductQAService } from './productQNA.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

// ================================================================
// 📝 CREATE PRODUCT Q&A
// ================================================================
const createProductQA = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createProductQAValidationSchema.parse(body);

  // ✅ FIX: Handle date conversion properly
  const payload: any = {
    qaId: validatedData.qaId,
    productId: new Types.ObjectId(validatedData.productId),
    userId: new Types.ObjectId(validatedData.userId),
    userName: validatedData.userName,
    userEmail: validatedData.userEmail,
    question: validatedData.question,
    status: validatedData.status || 'active',
  };

  // Optional fields
  if (validatedData.userImage) {
    payload.userImage = validatedData.userImage;
  }

  // ✅ Convert createdAt string to Date if provided
  if (validatedData.createdAt) {
    payload.createdAt = new Date(validatedData.createdAt);
  }

  // ✅ Handle answer object with date conversion
  if (validatedData.answer) {
    payload.answer = {
      answeredByName: validatedData.answer.answeredByName,
      answeredByEmail: validatedData.answer.answeredByEmail,
      answerText: validatedData.answer.answerText,
      // Convert answer createdAt to Date
      ...(validatedData.answer.createdAt && { 
        createdAt: new Date(validatedData.answer.createdAt) 
      }),
    };
  }

  const result = await ProductQAService.createProductQAInDB(payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Product question created successfully!',
    data: result,
  });
};

// ================================================================
// 📋 GET ALL PRODUCT Q&A
// ================================================================
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

// ================================================================
// 🔍 GET Q&A BY PRODUCT
// ================================================================
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

// ================================================================
// 🔍 GET Q&A BY USER
// ================================================================
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

// ================================================================
// ✏️ UPDATE PRODUCT Q&A (ADMIN ADDS ANSWER)
// ================================================================
const updateProductQA = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  console.log(id);
  
  const body = await req.json();
  const validatedData = updateProductQAValidationSchema.parse(body);

  // ✅ FIX: Build payload with proper type handling
  const payload: any = {};

  // Optional ObjectId conversions
  if (validatedData.productId) {
    payload.productId = new Types.ObjectId(validatedData.productId);
  }
  if (validatedData.userId) {
    payload.userId = new Types.ObjectId(validatedData.userId);
  }

  // Simple fields
  if (validatedData.qaId) payload.qaId = validatedData.qaId;
  if (validatedData.userName) payload.userName = validatedData.userName;
  if (validatedData.userEmail) payload.userEmail = validatedData.userEmail;
  if (validatedData.userImage) payload.userImage = validatedData.userImage;
  if (validatedData.question) payload.question = validatedData.question;
  if (validatedData.status) payload.status = validatedData.status;

  // ✅ Convert createdAt string to Date if provided
  if (validatedData.createdAt) {
    payload.createdAt = new Date(validatedData.createdAt);
  }

  // ✅ Handle answer object with date conversion
  if (validatedData.answer) {
    payload.answer = {
      ...(validatedData.answer.answeredByName && { 
        answeredByName: validatedData.answer.answeredByName 
      }),
      ...(validatedData.answer.answeredByEmail && { 
        answeredByEmail: validatedData.answer.answeredByEmail 
      }),
      ...(validatedData.answer.answerText && { 
        answerText: validatedData.answer.answerText 
      }),
      // Convert answer createdAt to Date
      ...(validatedData.answer.createdAt && { 
        createdAt: new Date(validatedData.answer.createdAt) 
      }),
    };
  }

  const result = await ProductQAService.updateProductQAWithAnswerInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product question updated successfully!',
    data: result,
  });
};

// ================================================================
// 🗑️ DELETE PRODUCT Q&A
// ================================================================
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

// ================================================================
// 📤 EXPORTS
// ================================================================
export const ProductQAController = {
  createProductQA,
  getAllProductQA,
  getProductQAByProduct,
  getProductQAByUser,
  updateProductQA,
  deleteProductQA,
};