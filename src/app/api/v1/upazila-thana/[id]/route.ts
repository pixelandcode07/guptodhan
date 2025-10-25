import { UpazilaThanaController } from "@/lib/modules/upazila-thana/upazilaThana.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(UpazilaThanaController.updateUpazilaThana));
export const DELETE = catchAsync(checkRole(["admin"])(UpazilaThanaController.deleteUpazilaThana));