/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Types } from 'mongoose'; // ✅ Types ইম্পোর্ট করুন
import { ISupportTicket, ISupportTicketConversation } from './supportTicket.interface'; // ✅ Interface ইম্পোর্ট করুন

/**
 * @description একটি নতুন সাপোর্ট টিকেট তৈরি করে।
 * @method POST
 */
const createTicket = async (req: NextRequest) => {
  await dbConnect();

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Authorization token missing.');
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
  const userId = (decoded as any).userId;
  if (!userId) throw new Error('Invalid token: User ID not found.');

  const formData = await req.formData();
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;
  const attachmentFile = formData.get('attachment') as File | null;

  const payload: any = {
    reporter: userId,
    subject: subject,
    message: message,
  };

  if (attachmentFile && attachmentFile.size > 0) {
    const buffer = Buffer.from(await attachmentFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'support-tickets');
    payload.attachment = uploadResult.secure_url;
  }

  const validatedData = createSupportTicketValidationSchema.parse(payload);
  
  // ✅ FIX 1: reporter (string) কে ObjectId তে রূপান্তর করা হয়েছে
  const payloadForService: Partial<ISupportTicket> = {
      ...validatedData,
      reporter: new Types.ObjectId(validatedData.reporter),
  };

  const result = await SupportTicketServices.createSupportTicketInDB(payloadForService);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Support ticket created successfully!',
    data: result,
  });
};

/**
 * @description সব সাপোর্ট টিকেট (বা স্ট্যাটাস অনুযায়ী ফিল্টার করা) নিয়ে আসে।
 * @method GET
 */
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

/**
 * @description একটি নির্দিষ্ট টিকেট ID দিয়ে খুঁজে বের করে।
 * @method GET
 */
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

/**
 * @description একটি টিকেটে নতুন রিপ্লাই (অ্যাডমিন বা ইউজার) যোগ করে।
 * @method POST
 */
const addReply = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  
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
  
  // ✅ FIX 2: অনুপস্থিত timestamp যোগ করা হয়েছে
  const replyPayload: ISupportTicketConversation = {
      ...validatedData,
      timestamp: new Date(),
  };

  const result = await SupportTicketServices.addReplyToTicketInDB(id, replyPayload);
  
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reply added successfully!',
    data: result,
  });
};

/**
 * @description একটি টিকেট ডিলিট করে।
 * @method DELETE
 */
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

/**
 * @description স্ট্যাটাস অনুযায়ী সব টিকেটের মোট সংখ্যা গণনা করে।
 * @method GET
 */
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

/**
 * @description শুধুমাত্র লগইন করা ইউজারের টিকেটগুলো ফেরত পাঠায়।
 * @method GET
 */
const getMySupportTickets = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) throw new Error('User ID not found in token.');

  const result = await SupportTicketServices.getTicketsByReporterIdFromDB(userId);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User support tickets retrieved successfully!',
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
  getMySupportTickets,
};