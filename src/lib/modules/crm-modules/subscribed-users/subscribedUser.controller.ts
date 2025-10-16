/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createSubscriberValidationSchema, updateSubscriberValidationSchema } from './subscribedUser.validation';
import { SubscriberServices } from './subscribedUser.service';
import dbConnect from '@/lib/db';

const createSubscriber = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createSubscriberValidationSchema.parse(body);
  const result = await SubscriberServices.createSubscriberInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Subscriber created successfully!',
    data: result,
  });
};

const getAllSubscribers = async (_req: NextRequest) => {
  await dbConnect();
  const result = await SubscriberServices.getAllSubscribersFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscribers retrieved successfully!',
    data: result,
  });
};

const getSubscriberById = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const result = await SubscriberServices.getSubscriberByIdFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriber retrieved successfully!',
    data: result,
  });
};

const updateSubscriber = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateSubscriberValidationSchema.parse(body);
  const result = await SubscriberServices.updateSubscriberInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriber updated successfully!',
    data: result,
  });
};

const deleteSubscriber = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  await SubscriberServices.deleteSubscriberFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriber deleted successfully!',
    data: null,
  });
};

export const SubscriberController = {
  createSubscriber,
  getAllSubscribers,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber,
};
