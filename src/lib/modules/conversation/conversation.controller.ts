import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { ConversationServices } from './conversation.service';
import { MessageServices } from '../message/message.service';
import { ClassifiedAd } from '../classifieds/ad.model';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';

// ✅ Token থেকে userId পাওয়া
const getUserIdFromToken = (req: NextRequest): string => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Authorization token missing or invalid.');
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as {
    userId: string;
  };
  console.log('✅ Token decoded, userId:', decoded);
  return decoded.userId;
};

// ✅ সমস্ত চ্যাট পাওয়া (FIXED)
const getMyConversations = async (req: NextRequest) => {
  try {
    await dbConnect();
    const userId = getUserIdFromToken(req);

    console.log('📡 getMyConversations called for user:', userId);

    const result = await ConversationServices.getMyConversationsFromDB(userId);

    console.log('📊 Conversations result:', {
      count: result.length,
      conversations: result.map((c: any) => ({
        id: c._id,
        ad: c.ad?.title,
        participants: c.participants?.length,
        lastMessage: c.lastMessage?._id,
      })),
    });

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Conversations retrieved',
      data: result,
    });
  } catch (error) {
    console.error('❌ Error in getMyConversations:', error);
    throw error;
  }
};

// ✅ একটা চ্যাট পাওয়া
const getConversation = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    await dbConnect();

    const userId = getUserIdFromToken(req);
    const { id: conversationId } = await context.params;

    console.log('📡 getConversation called:', {
      userId,
      conversationId,
    });

    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }

    const result = await ConversationServices.getConversationFromDB(
      conversationId,
      userId
    );

    console.log('✅ Conversation retrieved:', {
      id: result._id,
      ad: result.ad?.title,
      participants: result.participants?.map((p: any) => p.name),
    });

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Conversation retrieved',
      data: result,
    });
  } catch (error) {
    console.error('❌ Error in getConversation:', error);
    throw error;
  }
};

// ✅ মেসেজ পাওয়া
const getMessages = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    await dbConnect();
    const userId = getUserIdFromToken(req);
    const { id: conversationId } = await context.params;

    console.log('📡 getMessages called:', {
      userId,
      conversationId,
    });

    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }

    const result = await MessageServices.getMessagesFromDB(
      conversationId,
      userId
    );

    console.log('✅ Messages retrieved:', result.length);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Messages retrieved',
      data: result,
    });
  } catch (error) {
    console.error('❌ Error in getMessages:', error);
    throw error;
  }
};

// ✅ নতুন চ্যাট শুরু করা
const startConversation = async (req: NextRequest) => {
  try {
    await dbConnect();
    const userId = getUserIdFromToken(req);

    const { adId } = await req.json();

    console.log('📡 startConversation called:', {
      userId,
      adId,
    });

    if (!adId) {
      throw new Error('Ad ID is required');
    }

    const ad = await ClassifiedAd.findById(adId);
    if (!ad) {
      throw new Error('Ad not found');
    }

    console.log('✅ Ad found:', {
      id: ad._id,
      title: ad.title,
      seller: ad.user,
    });

    if (ad.user.toString() === userId) {
      throw new Error('You cannot start conversation with yourself');
    }

    const result = await ConversationServices.startConversationInDB(
      adId,
      userId,
      ad.user.toString()
    );

    console.log('✅ Conversation started/found:', result._id);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Conversation started',
      data: result,
    });
  } catch (error) {
    console.error('❌ Error in startConversation:', error);
    throw error;
  }
};

// ✅ মেসেজ পাঠানো (REST API)
const sendMessage = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    await dbConnect();
    const senderId = getUserIdFromToken(req);

    const { id: conversationId } = await context.params;
    const { receiverId, content } = await req.json();

    console.log('📡 sendMessage called:', {
      conversationId,
      senderId,
      receiverId,
      content: content?.substring(0, 50),
    });

    if (!conversationId || !receiverId || !content) {
      throw new Error('conversationId, receiverId, and content are required');
    }

    const result = await MessageServices.createMessageInDB(
      conversationId,
      senderId,
      receiverId,
      content
    );

    console.log('✅ Message created:', result._id);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Message sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('❌ Error in sendMessage:', error);
    throw error;
  }
};

// ✅ মেসেজ পড়া হিসেবে মার্ক করা
const markMessageAsRead = async (req: NextRequest) => {
  try {
    await dbConnect();
    const userId = getUserIdFromToken(req);

    const { messageId } = await req.json();

    if (!messageId) {
      throw new Error('messageId is required');
    }

    const result = await MessageServices.markAsReadInDB(messageId, userId);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Message marked as read',
      data: result,
    });
  } catch (error) {
    console.error('❌ Error in markMessageAsRead:', error);
    throw error;
  }
};

// ✅ অপঠিত মেসেজ সংখ্যা
const getUnreadCount = async (req: NextRequest) => {
  try {
    await dbConnect();
    const userId = getUserIdFromToken(req);

    const count = await MessageServices.getUnreadCountInDB(userId);

    console.log('📬 Unread count for', userId, ':', count);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Unread message count retrieved',
      data: { unreadCount: count },
    });
  } catch (error) {
    console.error('❌ Error in getUnreadCount:', error);
    throw error;
  }
};

export const ConversationController = {
  getMyConversations,
  getConversation,
  getMessages,
  startConversation,
  sendMessage,
  markMessageAsRead,
  getUnreadCount,
};