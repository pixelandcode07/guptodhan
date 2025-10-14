import { UpazilaThanaController } from "@/lib/modules/upazila-thana/upazilaThana.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(UpazilaThanaController.updateUpazilaThana);
export const DELETE = catchAsync(UpazilaThanaController.deleteUpazilaThana);