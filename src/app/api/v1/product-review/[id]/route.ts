import { ReviewController } from "@/lib/modules/product-review/productReview.controller";
import{ catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ReviewController.getReviewsByUser);
export const PATCH = catchAsync(ReviewController.updateReview);
export const DELETE = catchAsync(ReviewController.deleteReview);