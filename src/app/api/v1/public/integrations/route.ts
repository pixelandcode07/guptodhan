// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\public\integrations\route.ts
import { IntegrationsController } from '@/lib/modules/integrations/integrations.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// পাবলিক রুট: ফ্রন্টএন্ডে ইন্টিগ্রেশন ডেটা দেখানোর জন্য
export const GET = catchAsync(IntegrationsController.getPublicIntegrations);