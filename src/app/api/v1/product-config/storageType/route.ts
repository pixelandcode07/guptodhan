import { StorageTypeController } from "@/lib/modules/product-config/controllers/storageType.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(StorageTypeController.getAllStorageTypes);

export const POST = catchAsync(StorageTypeController.createStorageType);