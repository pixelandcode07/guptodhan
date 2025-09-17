import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "@/lib/utils/sendResponse";
import { OtpServices } from "./otp.service";
import { verifyPhoneOtpValidationSchema } from "./otp.validation";

const verifyPhoneOtp = async (req: NextRequest) => {
  const body = await req.json();
  const validatedData = verifyPhoneOtpValidationSchema.parse(body);

  await OtpServices.verifyPhoneNumberWithFirebase(validatedData.idToken);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Your phone number has been successfully verified!",
    data: null,
  });
};

export const OtpController = { verifyPhoneOtp };
