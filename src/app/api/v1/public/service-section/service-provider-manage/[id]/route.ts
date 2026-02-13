import { BookingController } from "@/lib/modules/service-section/serviceProviderManage/serviceProviderManage.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(BookingController.getBookingById);
export const PATCH = catchAsync(BookingController.updateBooking);