import { ConversationController } from '@/lib/modules/conversation/conversation.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(ConversationController.getMyConversations);
export const POST = catchAsync(ConversationController.startConversation);
