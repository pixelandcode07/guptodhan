// import { NextRequest } from "next/server";
// import { StatusCodes } from "http-status-codes";
// import { sendResponse } from "@/lib/utils/sendResponse";
// import { OtpServices } from "./otp.service";
// import { verifyPhoneOtpValidationSchema } from "./otp.validation";

// const verifyPhoneOtp = async (req: NextRequest) => {
//   const body = await req.json();
//   const validatedData = verifyPhoneOtpValidationSchema.parse(body);

//   await OtpServices.verifyPhoneNumberWithFirebase(validatedData.idToken);

//   return sendResponse({
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Your phone number has been successfully verified!",
//     data: null,
//   });
// };

// export const OtpController = { verifyPhoneOtp };



import { Request, Response } from "express";
import { sendOtpService, verifyOtpService } from "./otp.service";

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) return res.status(400).json({ error: "Phone is required" });

    const data = await sendOtpService(phone);

    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) return res.status(400).json({ error: "Missing fields" });

    const result = await verifyOtpService(phone, otp);

    result.status
      ? res.json({ success: true, message: "OTP verified" })
      : res.status(400).json(result);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
