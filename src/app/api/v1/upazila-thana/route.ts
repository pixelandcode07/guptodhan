import { UpazilaThanaController } from "@/lib/modules/upazila-thana/upazilaThana.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(UpazilaThanaController.getAllUpazilaThanas);
export const POST = catchAsync(UpazilaThanaController.createUpazilaThana);