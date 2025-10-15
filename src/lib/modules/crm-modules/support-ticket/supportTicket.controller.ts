/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import {
  createSupportTicketValidationSchema,
  updateSupportTicketValidationSchema,
} from './supportTicket.validation';
import { SupportTicketServices } from './supportTicket.service';
import dbConnect from '@/lib/db';

const createSupportTicket = async (req: NextRequest) => {
  await dbConnect();
  const formData = await req.formData();

  const customer = formData.get('customer') as string;
  const subject = formData.get('subject') as string;
  const attachmentFile = formData.get('attachment') as File | null;

  const payload: { customer: string; subject: string; attachment?: string } = {
    customer,
    subject,
  };

  if (attachmentFile) {
    const buffer = Buffer.from(await attachmentFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'support-tickets');
    payload.attachment = uploadResult.secure_url;
  }

  const validatedData = createSupportTicketValidationSchema.parse(payload);
  const result = await SupportTicketServices.createSupportTicketInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Support ticket created successfully!',
    data: result,
  });
};

const getAllSupportTickets = async (_req: NextRequest) => {
  await dbConnect();
  const result = await SupportTicketServices.getAllSupportTicketsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All support tickets retrieved successfully!',
    data: result,
  });
};

const getSupportTicketById = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const result = await SupportTicketServices.getSupportTicketByIdFromDB(id);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Support ticket retrieved successfully!',
    data: result,
  });
};

const updateSupportTicket = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateSupportTicketValidationSchema.parse(body);
  const result = await SupportTicketServices.updateSupportTicketInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Support ticket updated successfully!',
    data: result,
  });
};

const deleteSupportTicket = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  await SupportTicketServices.deleteSupportTicketFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Support ticket deleted successfully!',
    data: null,
  });
};

// ----------- FILTERED STATUS HANDLERS -----------
const getPendingTickets = async () => {
  await dbConnect();
  const result = await SupportTicketServices.getPendingTicketsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Pending support tickets retrieved successfully!',
    data: result,
  });
};

const getResolvedTickets = async () => {
  await dbConnect();
  const result = await SupportTicketServices.getResolvedTicketsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Resolved support tickets retrieved successfully!',
    data: result,
  });
};

const getRejectedTickets = async () => {
  await dbConnect();
  const result = await SupportTicketServices.getRejectedTicketsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Rejected support tickets retrieved successfully!',
    data: result,
  });
};

const getOnHoldTickets = async () => {
  await dbConnect();
  const result = await SupportTicketServices.getOnHoldTicketsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'On-hold support tickets retrieved successfully!',
    data: result,
  });
};

export const SupportTicketController = {
  createSupportTicket,
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  deleteSupportTicket,
  getPendingTickets,
  getResolvedTickets,
  getRejectedTickets,
  getOnHoldTickets,
};
