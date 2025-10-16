import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createContactRequestValidationSchema, updateContactRequestValidationSchema } from './contactReq.validation';
import { ContactRequestServices } from './contactReq.service';
import dbConnect from '@/lib/db';

const createContactRequest = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createContactRequestValidationSchema.parse(body);
  const result = await ContactRequestServices.createContactRequestInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Contact request created successfully!',
    data: result,
  });
};

const getAllContactRequests = async (_req: NextRequest) => {
  await dbConnect();
  const result = await ContactRequestServices.getAllContactRequestsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Contact requests retrieved successfully!',
    data: result,
  });
};

const getContactRequestById = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const result = await ContactRequestServices.getContactRequestByIdFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Contact request retrieved successfully!',
    data: result,
  });
};

const updateContactRequest = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateContactRequestValidationSchema.parse(body);
  const result = await ContactRequestServices.updateContactRequestInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Contact request updated successfully!',
    data: result,
  });
};

const deleteContactRequest = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  await ContactRequestServices.deleteContactRequestFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Contact request deleted successfully!',
    data: null,
  });
};

// ----------- FILTERED STATUS HANDLERS -----------
const getPendingContactRequests = async () => {
  await dbConnect();
  const result = await ContactRequestServices.getPendingContactRequestsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Pending contact requests retrieved successfully!',
    data: result,
  });
};

const getResolvedContactRequests = async () => {
  await dbConnect();
  const result = await ContactRequestServices.getResolvedContactRequestsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Resolved contact requests retrieved successfully!',
    data: result,
  });
};

export const ContactRequestController = {
  createContactRequest,
  getAllContactRequests,
  getContactRequestById,
  updateContactRequest,
  deleteContactRequest,
  getPendingContactRequests,
  getResolvedContactRequests,
};
