import { BookingController } from "@/lib/modules/service-section/serviceProviderManage/serviceProviderManage.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";


export const POST = catchAsync(BookingController.createBooking);