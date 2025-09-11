// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\public\footer-widgets\route.ts
import { FooterWidgetController } from '@/lib/modules/footer-widget/footerWidget.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
export const GET = catchAsync(FooterWidgetController.getPublicWidgets);