import { UploadController } from "@/lib/modules/upload/upload.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const POST = catchAsync(UploadController.uploadFile);
