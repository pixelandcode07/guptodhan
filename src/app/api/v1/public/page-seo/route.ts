import { PageSeoController } from '@/lib/modules/page-seo/page-seo.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get a single page's SEO and content for public display.
 * @example /api/v1/public/page-seo?title=about-us
 * @method GET
 */
export const GET = catchAsync(PageSeoController.getPublicPage);