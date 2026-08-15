import { BookingController } from "@/lib/modules/service-section/serviceProviderManage/serviceProviderManage.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(BookingController.getBookingByOrderId);
export const PATCH = catchAsync(BookingController.updateBooking);
export const DELETE = catchAsync(BookingController.deleteBooking); // ✅ DELETE API Added