import { VendorStoreController } from "@/lib/modules/vendor-store/vendorStore.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(VendorStoreController.getStoreById);

export const PATCH = catchAsync(VendorStoreController.updateStore);

export const DELETE = catchAsync(VendorStoreController.deleteStore);