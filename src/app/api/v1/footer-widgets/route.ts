// ফাইল পাথ: src/app/api/v1/footer-widgets/route.ts
import { FooterWidgetController } from '@/lib/modules/footer-widget/footerWidget.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const POST = catchAsync(checkRole(['admin'])(FooterWidgetController.createWidget));

/**
 * @description Get all footer widgets for the admin panel.
 * @method GET
 */
export const GET = catchAsync(checkRole(['admin'])(FooterWidgetController.getAllWidgetsForAdmin));