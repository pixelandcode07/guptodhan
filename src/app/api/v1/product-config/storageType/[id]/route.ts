import { StorageTypeController } from "@/lib/modules/product-config/controllers/storageType.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(StorageTypeController.updateStorageType);

export const DELETE = catchAsync(StorageTypeController.deleteStorageType);