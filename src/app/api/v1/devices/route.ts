import { Device } from "@/lib/modules/device/device.model";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { sendResponse } from "@/lib/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/db";

export const GET = catchAsync(async () => {
  await dbConnect();
  
  const devices = await Device.find().sort({ lastUsed: -1 });

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Devices retrieved successfully!',
    data: devices,
  });
});