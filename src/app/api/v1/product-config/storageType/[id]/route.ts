import { StorageTypeController } from "@/lib/modules/product-config/controllers/storageType.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(StorageTypeController.updateStorageType));
export const DELETE = catchAsync(checkRole(["admin"])(StorageTypeController.deleteStorageType));