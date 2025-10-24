import { StorageTypeController } from "@/lib/modules/product-config/controllers/storageType.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(checkRole(["admin"])(StorageTypeController.getAllStorageTypes));
export const POST = catchAsync(checkRole(["admin"])(StorageTypeController.createStorageType));