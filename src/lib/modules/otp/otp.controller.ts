
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

// Verify OTP (এটা আপডেট করা হয়েছে Next.js এর জন্য)
const verifyOtp = async (req: NextRequest) => {
  try {
    await dbConnect();
    const body = await req.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    // otp কে Number এ কনভার্ট করা হচ্ছে কারণ DB তে Number হিসেবে আছে
    const otpNumber = Number(otp); 
    const result = await OtpServices.verifyOtpService(phone, otpNumber);

    if (result.status) {
      return NextResponse.json(
        { success: true, message: "OTP verified successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error", error: error?.message },
      { status: 500 }
    );
  }
};

export const OtpController = { sendOtp, verifyOtp };
