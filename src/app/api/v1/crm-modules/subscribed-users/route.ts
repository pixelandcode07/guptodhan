import {SubscriberController} from '@/lib/modules/crm-modules/subscribed-users/subscribedUser.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(SubscriberController.getAllSubscribers);
export const POST = catchAsync(SubscriberController.createSubscriber);