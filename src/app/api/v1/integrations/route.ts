// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\integrations\route.ts
import { IntegrationsController } from '@/lib/modules/integrations/integrations.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// অ্যাডমিন রুট: ইন্টিগ্রেশন সেটিংস তৈরি বা আপডেট করার জন্য
export const POST = catchAsync(checkRole(['admin'])(IntegrationsController.createOrUpdateIntegrations));