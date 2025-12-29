import { Types } from 'mongoose';
import { Message } from './message.model';
import { Conversation } from '../conversation/conversation.model';
import { IMessage } from './message.interface';

// ✅ নতুন মেসেজ তৈরি করা (REST API থেকে)
const createMessageInDB = async (
  conversationId: string,
  senderId: string,
  receiverId: string,
  content: string
): Promise<IMessage> => {
  // ✅ Conversation verify করা
  const conversation = await Conversation.findOne({
    _id: new Types.ObjectId(conversationId),
    participants: { $in: [senderId, receiverId] },
  });

  if (!conversation) {
    throw new Error('Conversation not found or you are not a participant.');
  }

  // ✅ Message তৈরি করা
  const message = await Message.create({
    conversation: new Types.ObjectId(conversationId),
    sender: new Types.ObjectId(senderId),
    receiver: new Types.ObjectId(receiverId),
    content,
    isRead: false,
  });

  // ✅ Populate করে রিটার্ন করা
  return await Message.findById(message._id)
    .populate('sender', 'name profilePicture')
    .populate('receiver', 'name profilePicture') as IMessage;
};

// ✅ একটা চ্যাটের সমস্ত মেসেজ পাওয়া
const getMessagesFromDB = async (
  conversationId: string,
  userId: string
): Promise<IMessage[]> => {
  // ✅ User verify করা
  const conversation = await Conversation.findOne({
    _id: new Types.ObjectId(conversationId),
    participants: new Types.ObjectId(userId),
  });

  if (!conversation) {
    throw new Error('Conversation not found or you are not a participant.');
  }

  // ✅ মেসেজ পাওয়া
  const messages = await Message.find({ 
    conversation: new Types.ObjectId(conversationId) 
  })
    .populate('sender', 'name profilePicture')
    .populate('receiver', 'name profilePicture')
    .sort({ createdAt: 1 });

  return messages;
};

// ✅ মেসেজ পড়া হিসেবে মার্ক করা
const markAsReadInDB = async (
  messageId: string,
  userId: string
): Promise<IMessage | null> => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error('Message not found.');
  }

  // ✅ শুধুমাত্র receiver মার্ক করতে পারবে
  if (message.receiver.toString() !== userId) {
    throw new Error('Only receiver can mark message as read.');
  }

  return await Message.findByIdAndUpdate(
    messageId,
    { isRead: true },
    { new: true }
  ).populate('sender', 'name profilePicture') as IMessage;
};

// ✅ অপঠিত মেসেজ সংখ্যা পাওয়া
const getUnreadCountInDB = async (userId: string): Promise<number> => {
  const count = await Message.countDocuments({
    receiver: new Types.ObjectId(userId),
    isRead: false,
  });

  return count;
};

// ✅ সমস্ত অপঠিত মেসেজ পাওয়া
const getUnreadMessagesFromDB = async (
  userId: string
): Promise<IMessage[]> => {
  const unreadMessages = await Message.find({
    receiver: new Types.ObjectId(userId),
    isRead: false,
  })
    .populate('sender', 'name profilePicture')
    .populate('conversation', 'ad')
    .sort({ createdAt: -1 });

  return unreadMessages;
};

export const MessageServices = {
  createMessageInDB,
  getMessagesFromDB,
  markAsReadInDB,
  getUnreadCountInDB,
  getUnreadMessagesFromDB,
};