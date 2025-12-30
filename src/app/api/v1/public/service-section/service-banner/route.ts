import { ServiceBannerController } from "@/lib/modules/service-section/service-banner/serviceBanner.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";


export const GET = catchAsync(ServiceBannerController.getActiveServiceBanners);