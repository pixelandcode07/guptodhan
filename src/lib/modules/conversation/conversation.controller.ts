// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\conversation\conversation.controller.ts
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { ConversationServices } from './conversation.service';
import { ClassifiedAd } from '../classifieds/ad.model';
import dbConnect from '@/lib/db';

const getMyConversations = async (req: NextRequest) => {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    if (!userId) { throw new Error('User ID not found'); }
    const result = await ConversationServices.getMyConversationsFromDB(userId);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Conversations retrieved', data: result });
};

const getMessages = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    if (!userId) { throw new Error('User ID not found'); }
    const { id: conversationId } = params;
    const result = await ConversationServices.getMessagesFromDB(conversationId, userId);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Messages retrieved', data: result });
};

const startConversation = async (req: NextRequest) => {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    if (!userId) { throw new Error('User ID not found'); }

    const { adId } = await req.json();
    const ad = await ClassifiedAd.findById(adId);
    if (!ad) { throw new Error('Ad not found'); }

    const result = await ConversationServices.startConversationInDB(adId, userId, ad.user.toString());
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Conversation started', data: result });
};

export const ConversationController = {
  getMyConversations,
  getMessages,
  startConversation,
};