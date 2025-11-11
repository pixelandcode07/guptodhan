import { ISupportTicket, ISupportTicketConversation } from './supportTicket.interface';
import { SupportTicket } from './supportTicket.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import { User } from '../../user/user.model';
import mongoose, { Types } from 'mongoose';

const createSupportTicketInDB = async (payload: Partial<ISupportTicket>) => {
  // Add the first message to the conversation
  const ticketPayload = {
    ...payload,
    conversation: [{
      sender: 'user', // Assuming user creates it
      message: payload.message,
      attachment: payload.attachment,
      timestamp: new Date(),
    }]
  };
  const result = await SupportTicket.create(ticketPayload);
  return result;
};

const getAllTicketsFromDB = async (status?: string) => {
  const filter: any = {};
  if (status) {
    filter.status = status;
  }
  return await SupportTicket.find(filter)
    .populate('reporter', 'name email profilePicture')
    .sort({ createdAt: -1 })
    .lean();
};

const getTicketStatsFromDB = async () => {
  const stats = await SupportTicket.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  
  const result = {
    all: 0,
    Pending: 0,
    'In Progress': 0,
    Solved: 0,
    Rejected: 0,
    'On Hold': 0,
  };
  
  stats.forEach(stat => {
    if (result.hasOwnProperty(stat._id)) {
      result[stat._id as keyof typeof result] = stat.count;
      result.all += stat.count;
    }
  });
  return result;
};

const getSupportTicketByIdFromDB = async (id: string) => {
  const result = await SupportTicket.findById(id)
    .populate('reporter', 'name email profilePicture')
    
  if (!result) {
    throw new Error('Support ticket not found');
  }
  return result;
};

const updateTicketStatusInDB = async (id: string, status: ISupportTicket['status'], note?: string) => {
  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    throw new Error('Support ticket not found to update.');
  }
  
  ticket.status = status;
  
  // If admin adds a note, add it to the conversation
  if (note) {
    ticket.conversation.push({
        sender: 'admin',
        message: `Status changed to ${status}. Note: ${note}`,
        timestamp: new Date(),
    });
  }
  
  await ticket.save();
  return ticket;
};

const addReplyToTicketInDB = async (id: string, reply: ISupportTicketConversation) => {
    const ticket = await SupportTicket.findByIdAndUpdate(
        id,
        { $push: { conversation: reply } },
        { new: true }
    );
    if (!ticket) {
        throw new Error('Ticket not found.');
    }
    return ticket;
};

const deleteSupportTicketFromDB = async (id: string) => {
  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    throw new Error('Support ticket not found');
  }
  
  // Delete all attachments from Cloudinary
  if (ticket.attachment) await deleteFromCloudinary(ticket.attachment);
  for (const msg of ticket.conversation) {
    if (msg.attachment) await deleteFromCloudinary(msg.attachment);
  }

  await SupportTicket.findByIdAndDelete(id);
  return null;
};

const getTicketsByReporterIdFromDB = async (userId: string) => {
  return await SupportTicket.find({ reporter: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean();
};

export const SupportTicketServices = {
  createSupportTicketInDB,
  getAllTicketsFromDB,
  getSupportTicketByIdFromDB,
  updateTicketStatusInDB,
  addReplyToTicketInDB,
  deleteSupportTicketFromDB,
  getTicketStatsFromDB,
  getTicketsByReporterIdFromDB,
};