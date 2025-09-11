// ফাইল পাথ: src/app/api/v1/public/social-links/route.ts

import { SocialLinkController } from '@/lib/modules/social-link/socialLink.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// সকল সোশ্যাল লিঙ্ক দেখা (পাবলিক)
export const GET = catchAsync(SocialLinkController.getPublicSocialLinks);