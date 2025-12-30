import { NextRequest } from 'next/server';
import { ConversationController } from '@/lib/modules/conversation/conversation.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    // ✅ Pass context directly to controller (don't await here)
    return ConversationController.getConversation(req, context);
  }
);