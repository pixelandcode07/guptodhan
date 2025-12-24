// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\messages\unread-count\route.ts
import { ConversationController } from '@/lib/modules/conversation/conversation.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(ConversationController.getUnreadCount);