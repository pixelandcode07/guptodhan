import { SocialLinkController } from '@/lib/modules/social-link/socialLink.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(SocialLinkController.getPublicSocialLinks);