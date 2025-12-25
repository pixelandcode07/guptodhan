// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\conversations\[id]\messages\route.ts
import { NextRequest } from 'next/server'; // ✅ IMPORT NextRequest
import { ConversationController } from '@/lib/modules/conversation/conversation.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// ✅ GET messages with correct type
export const GET = catchAsync(
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    // ✅ Await the params Promise
    const params = await context.params;
    
    // Call controller with awaited params
    return ConversationController.getMessages(req, { params });
  }
);

// ✅ POST send message with correct type
export const POST = catchAsync(
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    // ✅ Await the params Promise
    const params = await context.params;
    
    // Call controller with awaited params
    return ConversationController.sendMessage(req, { params });
  }
);