import { BookingController } from "@/lib/modules/service-section/serviceProviderManage/serviceProviderManage.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(BookingController.cancelBooking);
