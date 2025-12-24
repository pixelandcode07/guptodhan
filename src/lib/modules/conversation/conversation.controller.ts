// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\conversation\conversation.controller.ts
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { ConversationServices } from './conversation.service';
import { MessageServices } from '../message/message.service';
import { ClassifiedAd } from '../classifieds/ad.model';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';

// ==========================================
// 🔐 HELPER: Get User ID from Token
// ==========================================
const getUserIdFromToken = (req: NextRequest): string => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Authorization token missing or invalid.');
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as {
    userId: string;
  };
  return decoded.userId;
};

// ==========================================
// 1. GET MY CONVERSATIONS
// ==========================================
const getMyConversations = async (req: NextRequest) => {
  await dbConnect();
  const userId = getUserIdFromToken(req);

  const result = await ConversationServices.getMyConversationsFromDB(userId);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Conversations retrieved',
    data: result,
  });
};

// ==========================================
// 2. GET SINGLE CONVERSATION (for chat page)
// ==========================================
const getConversation = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  console.log('📍 Controller: getConversation called');
  await dbConnect();

  const userId = getUserIdFromToken(req);
  const { id: conversationId } = params;

  console.log('👤 User ID:', userId);
  console.log('💬 Conversation ID:', conversationId);

  if (!conversationId) {
    throw new Error('Conversation ID is required');
  }

  try {
    const result = await ConversationServices.getConversationFromDB(
      conversationId,
      userId
    );

    console.log('✅ Controller: Conversation retrieved successfully');

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Conversation retrieved',
      data: result,
    });
  } catch (error) {
    console.error('❌ Controller: Error fetching conversation:', error);
    throw error;
  }
};

// ==========================================
// 3. GET MESSAGES OF A CONVERSATION
// ==========================================
const getMessages = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const userId = getUserIdFromToken(req);
  const { id: conversationId } = params;

  // ✅ Validate conversationId
  if (!conversationId) {
    throw new Error('Conversation ID is required');
  }

  const result = await MessageServices.getMessagesFromDB(
    conversationId,
    userId
  );
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Messages retrieved',
    data: result,
  });
};

// ==========================================
// 4. START NEW CONVERSATION
// ==========================================
const startConversation = async (req: NextRequest) => {
  await dbConnect();
  const userId = getUserIdFromToken(req);

  const { adId } = await req.json();

  // ✅ Validate adId
  if (!adId) {
    throw new Error('Ad ID is required');
  }

  // Ad exist করে কিনা check করুন
  const ad = await ClassifiedAd.findById(adId);
  if (!ad) {
    throw new Error('Ad not found');
  }

  // Buyer এবং seller same কিনা check করুন
  if (ad.user.toString() === userId) {
    throw new Error('You cannot start conversation with yourself');
  }

  const result = await ConversationServices.startConversationInDB(
    adId,
    userId, // current user = buyer
    ad.user.toString() // ad owner = seller
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Conversation started',
    data: result,
  });
};

// ==========================================
// 5. SEND MESSAGE (REST API method)
// ==========================================
const sendMessage = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const senderId = getUserIdFromToken(req);

  const { id: conversationId } = params;
  const { receiverId, content } = await req.json();

  // ✅ Validate all required fields
  if (!conversationId || !receiverId || !content) {
    throw new Error(
      'conversationId, receiverId, and content are required'
    );
  }

  const result = await MessageServices.createMessageInDB(
    conversationId,
    senderId,
    receiverId,
    content
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Message sent successfully',
    data: result,
  });
};

// ==========================================
// 6. MARK MESSAGE AS READ
// ==========================================
const markMessageAsRead = async (req: NextRequest) => {
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
};

// ==========================================
// 7. GET UNREAD MESSAGE COUNT
// ==========================================
const getUnreadCount = async (req: NextRequest) => {
  await dbConnect();
  const userId = getUserIdFromToken(req);

  const count = await MessageServices.getUnreadCountInDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Unread message count retrieved',
    data: { unreadCount: count },
  });
};

// ==========================================
// EXPORT ALL CONTROLLERS
// ==========================================
export const ConversationController = {
  getMyConversations,
  getConversation, // ✅ ADD THIS
  getMessages,
  startConversation,
  sendMessage,
  markMessageAsRead,
  getUnreadCount,
};