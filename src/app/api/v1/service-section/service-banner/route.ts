import { ServiceBannerController } from "@/lib/modules/service-section/service-banner/serviceBanner.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";


export const GET = catchAsync(checkRole(['admin'])(ServiceBannerController.getAllServiceBanners));
export const POST = catchAsync(checkRole(['admin'])(ServiceBannerController.updateServiceBanner));