import { catchAsync } from "@/lib/middlewares/catchAsync";
import { ClassifiedBannerController } from "@/lib/modules/classifieds-banner/banner.controller";

// সকল ব্যানার দেখা (পাবলিক)
export const GET = catchAsync(ClassifiedBannerController.getAllPublicBanners);