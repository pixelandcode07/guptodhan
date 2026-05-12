import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { OtpModel } from "./otp.model";
import { sendSMS } from "../../utils/smsPortal";

// ========================================
// 📧 Email Configuration
// ========================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

// ========================================
// 🔢 Generate 6-digit OTP
// ========================================
const generateOtp = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

// ========================================
// 🛡️ Rate Limiting (in-memory)
// ========================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (identifier: string): void => {
  const now = Date.now();
  const limit = rateLimitMap.get(identifier);

  if (limit) {
    if (now > limit.resetTime) {
      rateLimitMap.delete(identifier);
    } else if (limit.count >= 3) {
      const waitMinutes = Math.ceil((limit.resetTime - now) / 60000);
      throw new Error(
        `Too many OTP requests. Please try again in ${waitMinutes} minute(s).`
      );
    }
  }

  const current = limit ?? { count: 0, resetTime: now + 10 * 60 * 1000 };
  rateLimitMap.set(identifier, {
    count: current.count + 1,
    resetTime: current.resetTime,
  });
};

// ========================================
// 🗄️ Helper: OTP DB তে সেভ করা
// ========================================
const saveOtpRecord = async (
  identifier: string,
  otp: number,
  type: "phone" | "email"
): Promise<void> => {
  const shouldHash = process.env.HASH_OTP === "true";
  const otpToSave = shouldHash
    ? await bcrypt.hash(otp.toString(), 10)
    : otp;

  await OtpModel.create({
    identifier,
    otp: otpToSave,
    type,
    attempts: 0,
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || "3"),
    isBlocked: false,
    expiresAt: new Date(
      Date.now() +
        parseInt(process.env.OTP_EXPIRY_MINUTES || "5") * 60 * 1000
    ),
  });
};

// ========================================
// 📱 Send OTP via SMS (Phone)
// ========================================
const sendPhoneOtpService = async (phone: string) => {
  checkRateLimit(phone);

  const otp = generateOtp();
  console.log("📱 Generated SMS OTP:", otp);

  // DB তে save করা — phone number raw রাখা হচ্ছে (identifier হিসেবে)
  await saveOtpRecord(phone, otp, "phone");

  // SMS পাঠানো — formatBDPhoneNumber কাজটা smsPortal.ts এর ভেতরেই হবে
  const messageContent = `${otp} is your verification code. Valid for 5 minutes.`;
  const smsResult = await sendSMS(phone, messageContent);

  if (!smsResult.success) {
    // SMS fail হলেও OTP DB তে আছে, তবে warning দেওয়া হচ্ছে
    console.error("❌ SMS পাঠাতে ব্যর্থ:", smsResult.error ?? smsResult.data);
    // Production এ এখানে throw করতে পারেন যদি SMS mandatory হয়
    // throw new Error("Failed to send OTP via SMS");
  }

  const showOtp =
    process.env.NODE_ENV === "development" ||
    process.env.SHOW_OTP_IN_RESPONSE === "true";

  return {
    success: true,
    message: "OTP sent to your phone successfully",
    ...(showOtp && { otp }),
  };
};

// ========================================
// 📧 Send OTP via Email
// ========================================
const sendEmailOtpService = async (email: string) => {
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("Email credentials not configured in .env");
  }

  checkRateLimit(email);

  const otp = generateOtp();
  console.log("📧 Generated Email OTP:", otp);

  await saveOtpRecord(email, otp, "email");

  try {
    await transporter.sendMail({
      from: `"Guptodhan" <${process.env.SMTP_FROM || emailUser}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #111827;">Verification Code</h2>
          <p style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${otp}</p>
          <p style="color: #6b7280;">This code expires in 5 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });
    console.log("✅ Email successfully sent to", email);
  } catch (err: any) {
    console.error("❌ Email error:", err.message);
    throw new Error(`Failed to send email OTP: ${err.message}`);
  }

  const showOtp =
    process.env.NODE_ENV === "development" ||
    process.env.SHOW_OTP_IN_RESPONSE === "true";

  return {
    success: true,
    message: "OTP sent to your email successfully",
    ...(showOtp && { otp }),
  };
};

// ========================================
// 🛡️ Verify OTP
// ========================================
const verifyOtpService = async (
  identifier: string,
  otp: number,
  shouldDelete = false
) => {
  console.log(`🔍 Verifying OTP | identifier: ${identifier} | input: ${otp}`);

  const record = await OtpModel.findOne({ identifier }).sort({ createdAt: -1 });

  if (!record) {
    return { status: false, message: "OTP not found or already used" };
  }

  if (record.isBlocked) {
    return { status: false, message: "Too many wrong attempts. Try later." };
  }

  if (record.expiresAt < new Date()) {
    return { status: false, message: "OTP expired." };
  }

  // OTP match করা
  const shouldHash = process.env.HASH_OTP === "true";
  let isMatch = false;

  if (shouldHash && typeof record.otp === "string") {
    isMatch = await bcrypt.compare(otp.toString(), record.otp);
  } else {
    isMatch = Number(record.otp) === Number(otp);
  }

  if (!isMatch) {
    console.warn(`❌ OTP mismatch for ${identifier}`);
    return { status: false, message: "Invalid OTP" };
  }

  if (shouldDelete) {
    await OtpModel.deleteMany({ identifier });
    console.log(`✅ OTP verified and deleted for ${identifier}`);
  } else {
    console.log(`✅ OTP verified (kept) for ${identifier}`);
  }

  return { status: true, message: "OTP verified successfully" };
};

// ========================================
// 📤 Export
// ========================================
export const OtpServices = {
  sendPhoneOtpService,
  sendEmailOtpService,
  verifyOtpService,
};