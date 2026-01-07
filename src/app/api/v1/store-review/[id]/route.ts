import { StoreReviewController } from "@/lib/modules/store-review/storeReview.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(StoreReviewController.updateStoreReview);
export const DELETE = catchAsync(StoreReviewController.deleteStoreReview);