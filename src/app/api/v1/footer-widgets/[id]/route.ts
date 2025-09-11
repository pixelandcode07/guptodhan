// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\footer-widgets\[id]\route.ts
import { FooterWidgetController } from '@/lib/modules/footer-widget/footerWidget.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
export const PATCH = catchAsync(checkRole(['admin'])(FooterWidgetController.updateWidget));
export const DELETE = catchAsync(checkRole(['admin'])(FooterWidgetController.deleteWidget));