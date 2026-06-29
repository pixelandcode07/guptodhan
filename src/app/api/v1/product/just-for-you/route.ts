import { VendorProductController } from "@/lib/modules/product/vendorProduct.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

// GET request for Just For You recommendations
export const GET = catchAsync(VendorProductController.getJustForYouProducts);