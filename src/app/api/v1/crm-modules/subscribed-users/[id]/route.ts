import {SubscriberController} from '@/lib/modules/crm-modules/subscribed-users/subscribedUser.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const PATCH = catchAsync(SubscriberController.updateSubscriber);
export const DELETE = catchAsync(SubscriberController.deleteSubscriber);