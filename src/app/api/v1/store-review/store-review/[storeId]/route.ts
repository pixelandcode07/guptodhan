import { StoreReviewController } from "@/lib/modules/store-review/storeReview.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(StoreReviewController.getStoreReviewById);