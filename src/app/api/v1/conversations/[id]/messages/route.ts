import { NextRequest } from 'next/server';
import { ConversationController } from '@/lib/modules/conversation/conversation.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    return ConversationController.getMessages(req, context);
  }
);

export const POST = catchAsync(
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    return ConversationController.sendMessage(req, context);
  }
);