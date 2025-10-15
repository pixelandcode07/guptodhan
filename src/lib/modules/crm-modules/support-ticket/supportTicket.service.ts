import { ISupportTicket } from './supportTicket.interface';
import { SupportTicket } from './supportTicket.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createSupportTicketInDB = async (payload: Partial<ISupportTicket>) => {
  const result = await SupportTicket.create(payload);
  return result;
};

const getAllSupportTicketsFromDB = async () => {
  const result = await SupportTicket.find().sort({ createdAt: -1 });
  return result;
};

const getSupportTicketByIdFromDB = async (id: string) => {
  const result = await SupportTicket.findById(id);
  if (!result) {
    throw new Error('Support ticket not found');
  }
  return result;
};

const updateSupportTicketInDB = async (id: string, payload: Partial<ISupportTicket>) => {
  const result = await SupportTicket.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Support ticket not found to update.');
  }
  return result;
};

const deleteSupportTicketFromDB = async (id: string) => {
  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    throw new Error('Support ticket not found');
  }

  if (ticket.attachment) {
    await deleteFromCloudinary(ticket.attachment);
  }

  await SupportTicket.findByIdAndDelete(id);
  return null;
};

// --------- FILTERED QUERIES ---------
const getPendingTicketsFromDB = async () => {
  return await SupportTicket.find({ status: 'pending' }).sort({ createdAt: -1 });
};

const getResolvedTicketsFromDB = async () => {
  return await SupportTicket.find({ status: 'resolved' }).sort({ createdAt: -1 });
};

const getRejectedTicketsFromDB = async () => {
  return await SupportTicket.find({ status: 'reject' }).sort({ createdAt: -1 });
};

const getOnHoldTicketsFromDB = async () => {
  return await SupportTicket.find({ status: 'on hold' }).sort({ createdAt: -1 });
};

export const SupportTicketServices = {
  createSupportTicketInDB,
  getAllSupportTicketsFromDB,
  getSupportTicketByIdFromDB,
  updateSupportTicketInDB,
  deleteSupportTicketFromDB,
  getPendingTicketsFromDB,
  getResolvedTicketsFromDB,
  getRejectedTicketsFromDB,
  getOnHoldTicketsFromDB,
};
