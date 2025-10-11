import { ProductQAController } from "@/lib/modules/product-qna/productQNA.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(ProductQAController.updateProductQA);
export const DELETE = catchAsync(ProductQAController.deleteProductQA);