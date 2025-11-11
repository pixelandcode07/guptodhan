import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import {
  createSupportTicketValidationSchema,
  updateTicketStatusValidationSchema,
  addReplyValidationSchema,
} from './supportTicket.validation';
import { SupportTicketServices } from './supportTicket.service';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';

const createTicket = async (req: NextRequest) => {
  await dbConnect();
  
  // --- Get User ID from token ---
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Authorization token missing.');
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
  const userId = (decoded as any).userId;
  if (!userId) throw new Error('Invalid token.');
  
  const formData = await req.formData();
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;
  const attachmentFile = formData.get('attachment') as File | null;

  const payload: any = { reporter: userId, subject, message };

  if (attachmentFile && attachmentFile.size > 0) {
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

const getAllTickets = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;

  const result = await SupportTicketServices.getAllTicketsFromDB(status);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Support tickets retrieved successfully!',
    data: result,
  });
};

const getTicketById = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const result = await SupportTicketServices.getSupportTicketByIdFromDB(id);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Support ticket retrieved successfully!',
    data: result,
  });
};

const updateTicketStatus = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const { status, note } = updateTicketStatusValidationSchema.parse(body);
  const result = await SupportTicketServices.updateTicketStatusInDB(id, status, note);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Support ticket status updated!',
    data: result,
  });
};

const addReply = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  
  // --- Get User Role from token ---
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Authorization token missing.');
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
  const userRole = (decoded as any).role;
  
  const formData = await req.formData();
  const message = formData.get('message') as string;
  const attachmentFile = formData.get('attachment') as File | null;
  
  const payload: any = { 
    sender: userRole === 'admin' ? 'admin' : 'user',
    message 
  };

  if (attachmentFile && attachmentFile.size > 0) {
    const buffer = Buffer.from(await attachmentFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'support-tickets');
    payload.attachment = uploadResult.secure_url;
  }
  
  const validatedData = addReplyValidationSchema.parse(payload);
  const result = await SupportTicketServices.addReplyToTicketInDB(id, validatedData);
  
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reply added successfully!',
    data: result,
  });
};

const deleteTicket = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  await SupportTicketServices.deleteSupportTicketFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Support ticket deleted successfully!',
    data: null,
  });
};

const getTicketStats = async (req: NextRequest) => {
  await dbConnect();
  const result = await SupportTicketServices.getTicketStatsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ticket stats retrieved successfully!',
    data: result,
  });
};

export const SupportTicketController = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  addReply,
  deleteTicket,
  getTicketStats,
};