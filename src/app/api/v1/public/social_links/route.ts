import { catchAsync } from "@/lib/middlewares/catchAsync";
import { SocialLinksController } from "@/lib/modules/social-links/social-links.controller";

/**
 * @description Create or update social media links. (Admin Only)
 * @method POST
 */
export const GET = catchAsync(SocialLinksController.getPublicSocialLinks);