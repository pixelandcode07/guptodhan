import { UpazilaThanaController } from "@/lib/modules/upazila-thana/upazilaThana.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(UpazilaThanaController.getAllUpazilaThanas);
export const POST = catchAsync(checkRole(["admin"])(UpazilaThanaController.createUpazilaThana));