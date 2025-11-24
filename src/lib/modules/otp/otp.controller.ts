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
import { OtpServices } from "./otp.service";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";

const sendOtp = async (req: NextRequest) => {
  try {
    await dbConnect();
     const body = await req.json();
    const { phone } = body;

    console.log(phone);
    // const phone = "8801688399676"; // For testing purpose only. Remove this line in production.

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    const data = await OtpServices.sendOtpService(phone);

    return NextResponse.json(
      { success: true, message: "OTP sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP Error:", error);

    return NextResponse.json(
      { success: false, message: "Server error", error: error?.message },
      { status: 500 }
    );
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp)
      return res.status(400).json({ error: "Missing fields" });

    const result = await OtpServices.verifyOtpService(phone, otp);

    result.status
      ? res.json({ success: true, message: "OTP verified" })
      : res.status(400).json(result);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const OtpController = { sendOtp, verifyOtp };
