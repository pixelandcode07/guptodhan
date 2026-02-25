import { NotificationController } from '@/lib/modules/notification/notification.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const POST = catchAsync(NotificationController.sendToSpecificDevice);