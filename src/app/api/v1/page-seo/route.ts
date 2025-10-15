import { PageSeoController } from '@/lib/modules/page-seo/page-seo.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const POST = catchAsync(checkRole(['admin'])(PageSeoController.createPage));
export const GET = catchAsync(checkRole(['admin'])(PageSeoController.getAllPages));