import { catchAsync } from "@/lib/middlewares/catchAsync";
import { StoreReviewController } from "@/lib/modules/store-review/storeReview.controller";

export const GET = catchAsync(StoreReviewController.getStoreReviewsByStoreId);