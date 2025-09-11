// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\social-links\route.ts

import { SocialLinkController } from '@/lib/modules/social-link/socialLink.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// সকল সোশ্যাল লিঙ্ক দেখা (পাবলিক)
export const GET = catchAsync(SocialLinkController.getPublicSocialLinks);
// নতুন সোশ্যাল লিঙ্ক তৈরি করা (শুধুমাত্র অ্যাডমিন)
export const POST = catchAsync(checkRole(['admin'])(SocialLinkController.createSocialLink));