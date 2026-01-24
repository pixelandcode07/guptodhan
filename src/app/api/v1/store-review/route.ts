import { StoreReviewController } from "@/lib/modules/store-review/storeReview.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const POST = catchAsync(StoreReviewController.createStoreReview);
export const GET = catchAsync(StoreReviewController.getAllStoreReviews);