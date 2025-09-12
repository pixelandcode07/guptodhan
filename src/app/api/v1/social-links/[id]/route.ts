// নতুন ফাইল
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\social-links\[id]\route.ts

import { SocialLinkController } from '@/lib/modules/social-link/socialLink.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// সোশ্যাল লিঙ্ক আপডেট করা (শুধুমাত্র অ্যাডমিন)
export const PATCH = catchAsync(checkRole(['admin'])(SocialLinkController.updateSocialLink));
// সোশ্যাল লিঙ্ক ডিলিট করা (শুধুমাত্র অ্যাডমিন)
export const DELETE = catchAsync(checkRole(['admin'])(SocialLinkController.deleteSocialLink));