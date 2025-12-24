// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\conversation\conversation.service.ts
import { Conversation } from './conversation.model';
import { Message } from '../message/message.model';
import { Types } from 'mongoose';

const getMyConversationsFromDB = async (userId: string) => {
  return await Conversation.find({ participants: userId })
    .populate('participants', 'name profilePicture')
    .populate('ad', 'title images')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
};

const getMessagesFromDB = async (conversationId: string, userId: string) => {
  // নিরাপত্তা: নিশ্চিত করা হচ্ছে যে শুধুমাত্র কথোপকথনের অংশগ্রহণকারীরাই মেসেজ দেখতে পারবে
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new Error('Conversation not found or you are not a participant.');
  }

  return await Message.find({ conversation: conversationId }).sort({
    createdAt: 'asc',
  });
};

const startConversationInDB = async (
  adId: string,
  buyerId: string,
  sellerId: string
) => {
  // চেক করা হচ্ছে এই বিজ্ঞাপন নিয়ে আগে থেকেই কোনো চ্যাট আছে কিনা
  let conversation = await Conversation.findOne({
    ad: adId,
    participants: { $all: [buyerId, sellerId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      ad: adId,
      participants: [buyerId, sellerId],
    });
  }

  return conversation;
};

// ==========================================
// ✅ GET SINGLE CONVERSATION WITH FULL DATA
// ==========================================
const getConversationFromDB = async (conversationId: string, userId: string) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  })
    .populate('participants', 'name profilePicture') 
    .populate('ad', 'title images')
    .populate('lastMessage');

  if (!conversation) {
    throw new Error('Conversation not found or access denied.');
  }

  return conversation;
};

export const ConversationServices = {
  getMyConversationsFromDB,
  getMessagesFromDB,
  startConversationInDB,
  getConversationFromDB, // ✅ EXPORT THIS
};