import axios from "axios";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { OtpModel } from "./otp.model";

// ========================================
// 📧 Email Configuration
// ========================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "465"),
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
// 🛠️ Helper: Format Bangladeshi Number
// ========================================
const formatPhoneNumber = (phone: string): string => {
  let formatted = phone.replace(/[\s-]/g, '');
  if (formatted.startsWith('01')) {
      formatted = '88' + formatted;
  } else if (formatted.startsWith('+88')) {
      formatted = formatted.substring(1);
  }
  return formatted;
};

// ========================================
// 🛡️ Rate Limiting Check
// ========================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = async (identifier: string): Promise<void> => {
  const now = Date.now();
  const limit = rateLimitMap.get(identifier);

  if (limit) {
    if (now > limit.resetTime) {
      rateLimitMap.delete(identifier);
    } else if (limit.count >= 3) {
      const waitMinutes = Math.ceil((limit.resetTime - now) / 60000);
      throw new Error(`Too many OTP requests. Please try again in ${waitMinutes} minutes.`);
    }
  }

  const current = limit || { count: 0, resetTime: now + 10 * 60 * 1000 }; 
  rateLimitMap.set(identifier, {
    count: current.count + 1,
    resetTime: current.resetTime,
  });
};

// ========================================
// 📱 Send OTP to Phone (SMS)
// ========================================
const sendPhoneOtpService = async (phone: string) => {
  await checkRateLimit(phone);

  const otp = generateOtp();
  console.log("📱 Generated SMS OTP:", otp);

  const formattedPhone = formatPhoneNumber(phone);
  
  const shouldHashOtp = process.env.HASH_OTP === 'true';
  const otpToSave = shouldHashOtp ? await bcrypt.hash(otp.toString(), 10) : otp;

  await OtpModel.create({
    identifier: phone,
    otp: otpToSave,
    type: 'phone',
    attempts: 0,
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3'),
    isBlocked: false,
    expiresAt: new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || '5') * 60 * 1000),
  });

  // SMS Sending Logic
  const shouldSendSMS = process.env.FORCE_SMS_SEND === 'true' || process.env.NODE_ENV !== 'development';

  if (shouldSendSMS) {
    try {
      const url = "https://api.sms.net.bd/sendsms";
      const messageContent = `${otp} is your verification code. Valid for 5 minutes.`;

      const response = await axios.post(url, {
        api_key: process.env.SMS_API_KEY,
        msg: messageContent, 
        to: formattedPhone,
      });

      if (response.data.error === 0) {
        console.log(`✅ SMS Sent Successfully! Msg ID: ${response.data.msg_id}`);
      } else {
        console.warn(`⚠️ SMS Gateway Warning:`, response.data);
      }
    } catch (error: any) {
      console.error("❌ SMS Network Error:", error.message);
    }
  } else {
    console.log("⚠️ SMS Skipped (Dev Mode). Set FORCE_SMS_SEND='true' in .env to send real SMS.");
  }

  const showOtpInResponse = process.env.NODE_ENV === 'development' || 
                            process.env.SHOW_OTP_IN_RESPONSE === 'true';

  return { 
    success: true, 
    message: "OTP sent to your phone successfully",
    ...(showOtpInResponse && { otp }), 
  };
};

// ========================================
// 📧 Send OTP to Email
// ========================================
const sendEmailOtpService = async (email: string) => {
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error('Email credentials not configured');
  }

  await checkRateLimit(email);

  const otp = generateOtp();
  console.log("📧 Generated Email OTP:", otp);

  const shouldHashOtp = process.env.HASH_OTP === 'true';
  const otpToSave = shouldHashOtp ? await bcrypt.hash(otp.toString(), 10) : otp;

  await OtpModel.create({
    identifier: email,
    otp: otpToSave,
    type: 'email',
    attempts: 0,
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3'),
    isBlocked: false,
    expiresAt: new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || '5') * 60 * 1000),
  });

  try {
    await transporter.sendMail({
      from: `"Guptodhan" <${process.env.SMTP_FROM || emailUser}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your Verification Code</h2>
          <p style="font-size: 24px; font-weight: bold; color: #4F46E5;">${otp}</p>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    });
    console.log("✅ Email sent successfully");
  } catch (error: any) {
    console.error("❌ Email error:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  const showOtpInResponse = process.env.NODE_ENV === 'development' || 
                            process.env.SHOW_OTP_IN_RESPONSE === 'true';

  return { 
    success: true, 
    message: "OTP sent to email successfully",
    ...(showOtpInResponse && { otp }), 
  };
};

// ========================================
// ✅ Verify OTP (CRITICAL FIX applied here)
// ========================================
// shouldDelete ডিফল্ট false করে দেওয়া হয়েছে যাতে প্রথমবার চেক করলে ডিলিট না হয়
const verifyOtpService = async (identifier: string, otp: number, shouldDelete = false) => {
  console.log(`🔍 Verifying OTP for: ${identifier}, shouldDelete: ${shouldDelete}`);

  const record = await OtpModel.findOne({ identifier }).sort({ createdAt: -1 });

  if (!record) return { status: false, message: "OTP not found or already used" };
  if (record.isBlocked) return { status: false, message: "Too many wrong attempts. Please request a new OTP." };
  if (record.expiresAt < new Date()) return { status: false, message: "OTP expired. Please request a new one." };

  const shouldHashOtp = process.env.HASH_OTP === 'true';
  let isMatch = false;

  if (shouldHashOtp && typeof record.otp === 'string') {
    isMatch = await bcrypt.compare(otp.toString(), record.otp);
  } else {
    isMatch = record.otp === otp;
  }

  if (!isMatch) {
    record.attempts += 1;
    if (record.attempts >= record.maxAttempts) {
      record.isBlocked = true;
      await record.save();
      return { status: false, message: "Maximum attempts exceeded. Please request a new OTP." };
    }
    await record.save();
    return { status: false, message: "Invalid OTP" };
  }

  // ✅ Only delete if explicitly requested (e.g., after account creation)
  if (shouldDelete) {
      await OtpModel.deleteMany({ identifier });
      console.log(`✅ OTP verified and DELETED from DB`);
  } else {
      console.log(`✅ OTP verified (KEPT in DB for next step)`);
  }

  return { status: true, message: "OTP verified successfully" };
};

export const OtpServices = { 
  sendPhoneOtpService, 
  sendEmailOtpService,
  verifyOtpService 
};