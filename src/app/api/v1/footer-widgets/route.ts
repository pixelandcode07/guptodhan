// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\footer-widgets\route.ts
import { FooterWidgetController } from '@/lib/modules/footer-widget/footerWidget.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
export const POST = catchAsync(checkRole(['admin'])(FooterWidgetController.createWidget));