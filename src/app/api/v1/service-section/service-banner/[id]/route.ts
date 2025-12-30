import { ServiceBannerController } from "@/lib/modules/service-section/service-banner/serviceBanner.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(checkRole(['admin'])(ServiceBannerController.getServiceBannerById));
export const PATCH = catchAsync(checkRole(['admin'])(ServiceBannerController.updateServiceBanner));
export const DELETE = catchAsync(checkRole(['admin'])(ServiceBannerController.deleteServiceBanner));