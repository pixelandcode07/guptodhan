// ফাইল পাথ: src/app/api/v1/conversations/[id]/route.ts
import { NextRequest } from 'next/server';
import { ConversationController } from '@/lib/modules/conversation/conversation.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const params = await context.params;
    
    // ✅ ভুল ছিল এখানে: getMessages এর বদলে getConversation হবে
    return ConversationController.getConversation(req, { params });
  }
);