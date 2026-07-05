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
    
    // ✅ MAGIC FIX: ফ্রন্টএন্ড থেকে 'phone', 'phoneNumber', 'email' বা 'identifier' যাই আসুক, অটোমেটিক ক্যাচ করবে
    const targetEmail = body.email || (body.identifier?.includes('@') ? body.identifier : undefined);
    const targetPhone = body.phone || body.phoneNumber || (body.identifier && !body.identifier.includes('@') ? body.identifier : undefined);

    // Validation: At least one must be provided
    if (!targetEmail && !targetPhone) {
      return NextResponse.json(
        { success: false, message: "Either email or phone number is required" },
        { status: 400 }
      );
    }

    let result;
    let type;

    // ✅ Smart Detection: Send to Email or Phone
    if (targetEmail) {
      result = await OtpServices.sendEmailOtpService(targetEmail);
      type = 'email';
    } else if (targetPhone) {
      result = await OtpServices.sendPhoneOtpService(targetPhone);
      type = 'phone';
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `OTP sent to ${type} successfully`,
        data: {
          type,
          identifier: targetEmail || targetPhone,
          ...result
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ OTP Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to send OTP", error: error?.message },
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
    
    // ✅ MAGIC FIX: identifier, phone, phoneNumber, বা email যে নামেই আসুক না কেন, এটা কাজ করবে
    const targetIdentifier = body.identifier || body.phoneNumber || body.phone || body.email;
    const otp = body.otp; 

    if (!targetIdentifier || !otp) {
      return NextResponse.json(
        { success: false, message: "Identifier (email/phone) and OTP are required" },
        { status: 400 }
      );
    }

    // Convert OTP to number
    const otpNumber = Number(otp);
    
    if (isNaN(otpNumber)) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP format" },
        { status: 400 }
      );
    }

    // 🔥 CRITICAL FIX: Pass FALSE here to NOT delete OTP yet
    // Because the user still needs to use this OTP to create the account in the next step
    const result = await OtpServices.verifyOtpService(targetIdentifier, otpNumber, false);

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
    console.error("❌ OTP Verification Error:", error);
    
    return NextResponse.json(
      { success: false, message: "Server error", error: error?.message },
      { status: 500 }
    );
  }
};

export const OtpController = { sendOtp, verifyOtp };