// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\message\message.service.ts
import { Types } from 'mongoose';
import { Message } from './message.model';
import { Conversation } from '../conversation/conversation.model';
import { IMessage } from './message.interface';

const createMessageInDB = async (
  conversationId: string,
  senderId: string,
  receiverId: string,
  content: string
): Promise<IMessage> => {
  const message = await Message.create({
    conversation: new Types.ObjectId(conversationId),
    sender: new Types.ObjectId(senderId),
    receiver: new Types.ObjectId(receiverId),
    content,
    isRead: false,
  });

  // Message কে populate করে return করুন
  return await Message.findById(message._id)
    .populate('sender', 'name profilePicture')
    .populate('receiver', 'name profilePicture') as IMessage;
};

const getMessagesFromDB = async (
  conversationId: string,
  userId: string
): Promise<IMessage[]> => {
  // নিরাপত্তা: শুধুমাত্র conversation participant রা messages দেখতে পাবে
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new Error('Conversation not found or you are not a participant.');
  }

  const messages = await Message.find({ conversation: conversationId })
    .populate('sender', 'name profilePicture')
    .populate('receiver', 'name profilePicture')
    .sort({ createdAt: 1 });

  return messages;
};

const markAsReadInDB = async (
  messageId: string,
  userId: string
): Promise<IMessage | null> => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error('Message not found.');
  }

  // শুধুমাত্র receiver markAsRead করতে পারবে
  if (message.receiver.toString() !== userId) {
    throw new Error('Only receiver can mark message as read.');
  }

  return await Message.findByIdAndUpdate(
    messageId,
    { isRead: true },
    { new: true }
  ).populate('sender', 'name profilePicture') as IMessage;
};

const getUnreadCountInDB = async (userId: string): Promise<number> => {
  const count = await Message.countDocuments({
    receiver: new Types.ObjectId(userId),
    isRead: false,
  });

  return count;
};

export const MessageServices = {
  createMessageInDB,
  getMessagesFromDB,
  markAsReadInDB,
  getUnreadCountInDB,
};