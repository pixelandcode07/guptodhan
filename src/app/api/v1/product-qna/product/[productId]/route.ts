import { ProductQAController } from "@/lib/modules/product-qna/productQNA.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ProductQAController.getProductQAByProduct);

