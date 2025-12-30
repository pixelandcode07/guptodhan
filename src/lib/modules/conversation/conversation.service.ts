import { Conversation } from './conversation.model';
import { Message } from '../message/message.model';
import { Types } from 'mongoose';

// ✅ সমস্ত চ্যাট পাওয়া (যেখানে মেসেজ আছে) - FIXED
const getMyConversationsFromDB = async (userId: string) => {
  console.log('🔍 Searching conversations for userId:', userId);
  
  // ✅ FIX: userId কে ObjectId তে convert করা (ছিল না)
  const objectId = new Types.ObjectId(userId);
  
  const result = await Conversation.find({ 
    participants: objectId,
    // ❌ REMOVED: lastMessage condition (কারণ নতুন conversation এ lastMessage থাকবে না)
    // lastMessage: { $exists: true, $ne: null }
  })
    .populate('participants', 'name profilePicture')
    .populate('ad', 'title images')
    .populate('lastMessage')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'name'
      }
    })
    .sort({ updatedAt: -1 });

  console.log('📊 Found conversations:', result.length);
  return result;
};

// ✅ একটা specific চ্যাট পাওয়া
const getConversationFromDB = async (conversationId: string, userId: string) => {
  console.log('🔍 Getting conversation:', conversationId, 'for user:', userId);
  
  const conversation = await Conversation.findOne({
    _id: new Types.ObjectId(conversationId),
    participants: new Types.ObjectId(userId),
  })
    .populate('participants', 'name profilePicture')
    .populate('ad', 'title images')
    .populate('lastMessage');

  if (!conversation) {
    console.error('❌ Conversation not found');
    throw new Error('Conversation not found or access denied.');
  }

  console.log('✅ Conversation found:', {
    id: conversation._id,
    ad: conversation.ad,
    participants: conversation.participants,
  });

  return conversation;
};

// ✅ একটা চ্যাটের মেসেজ পাওয়া
const getMessagesFromDB = async (conversationId: string, userId: string) => {
  console.log('📥 Getting messages for conversation:', conversationId);
  
  const conversation = await Conversation.findOne({
    _id: new Types.ObjectId(conversationId),
    participants: new Types.ObjectId(userId),
  });

  if (!conversation) {
    console.error('❌ Conversation not found or user not participant');
    throw new Error('Conversation not found or you are not a participant.');
  }

  const messages = await Message.find({ 
    conversation: new Types.ObjectId(conversationId) 
  })
    .populate('sender', 'name profilePicture')
    .populate('receiver', 'name profilePicture')
    .sort({ createdAt: 1 });

  console.log('✅ Messages retrieved:', messages.length);
  return messages;
};

// ✅ নতুন চ্যাট শুরু করা
const startConversationInDB = async (
  adId: string,
  buyerId: string,
  sellerId: string
) => {
  console.log('🆕 Starting conversation:', {
    adId,
    buyerId,
    sellerId,
  });

  // চেক করা: আগে থেকেই চ্যাট আছে কিনা
  let conversation = await Conversation.findOne({
    ad: new Types.ObjectId(adId),
    participants: { $all: [new Types.ObjectId(buyerId), new Types.ObjectId(sellerId)] },
  });

  if (conversation) {
    console.log('📌 Conversation already exists:', conversation._id);
    return conversation;
  }

  // না থাকলে নতুন করে তৈরি করা
  conversation = await Conversation.create({
    ad: new Types.ObjectId(adId),
    participants: [new Types.ObjectId(buyerId), new Types.ObjectId(sellerId)],
  });

  console.log('✅ Conversation created:', conversation._id);
  return conversation;
};

export const ConversationServices = {
  getMyConversationsFromDB,
  getConversationFromDB,
  getMessagesFromDB,
  startConversationInDB,
};