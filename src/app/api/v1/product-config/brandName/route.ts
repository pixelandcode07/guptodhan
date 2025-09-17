import { BrandController } from "@/lib/modules/product-config/controllers/brandName.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(BrandController.getAllBrands);

export const POST = catchAsync(BrandController.createBrand);