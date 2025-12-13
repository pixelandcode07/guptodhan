import { catchAsync } from "@/lib/middlewares/catchAsync";
import { BrandController } from "@/lib/modules/brand/brand.controller";

// সকল ব্র্যান্ড দেখা (পাবলিক)
export const GET = catchAsync(BrandController.getAllBrands);