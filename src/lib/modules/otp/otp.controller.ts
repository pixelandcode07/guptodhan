import { OtpServices } from "./otp.service";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";

// ========================================
// 📤 Send OTP (Auto-detect Email or Phone)
// ========================================
const sendOtp = async (req: NextRequest) => {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, phone } = body;

    // Validation: At least one must be provided
    if (!email && !phone) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Either email or phone number is required" 
        },
        { status: 400 }
      );
    }

    let result;
    let type;

    // ✅ Smart Detection: Send to Email or Phone
    if (email) {
      result = await OtpServices.sendEmailOtpService(email);
      type = 'email';
    } else if (phone) {
      result = await OtpServices.sendPhoneOtpService(phone);
      type = 'phone';
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `OTP sent to ${type} successfully`,
        data: {
          type,
          identifier: email || phone,
          ...result
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ OTP Error:", error);

    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to send OTP", 
        error: error?.message 
      },
      { status: 500 }
    );
  }
};

// ========================================
// ✅ Verify OTP (Works for both Email & Phone)
// ========================================
const verifyOtp = async (req: NextRequest) => {
  try {
    await dbConnect();
    const body = await req.json();
    const { identifier, otp } = body; // identifier can be email or phone

    if (!identifier || !otp) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Identifier (email/phone) and OTP are required" 
        },
        { status: 400 }
      );
    }

    // Convert OTP to number
    const otpNumber = Number(otp);
    
    if (isNaN(otpNumber)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid OTP format" 
        },
        { status: 400 }
      );
    }

    const result = await OtpServices.verifyOtpService(identifier, otpNumber);

    if (result.status) {
      return NextResponse.json(
        { 
          success: true, 
          message: "OTP verified successfully" 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message 
        },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error("❌ OTP Verification Error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error", 
        error: error?.message 
      },
      { status: 500 }
    );
  }
};

export const OtpController = { sendOtp, verifyOtp };