import { ReviewController } from "@/lib/modules/product-review/productReview.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ReviewController.getAllReviews);
export const POST = catchAsync(ReviewController.createReview);