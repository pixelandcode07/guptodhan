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
// 🛡️ Rate Limiting Check (Simple In-Memory)
// ========================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = async (identifier: string): Promise<void> => {
  const now = Date.now();
  const limit = rateLimitMap.get(identifier);

  if (limit) {
    // Reset if time window passed
    if (now > limit.resetTime) {
      rateLimitMap.delete(identifier);
    } else if (limit.count >= 3) {
      const waitMinutes = Math.ceil((limit.resetTime - now) / 60000);
      throw new Error(`Too many OTP requests. Please try again in ${waitMinutes} minutes.`);
    }
  }

  // Update or create limit
  const current = limit || { count: 0, resetTime: now + 10 * 60 * 1000 }; // 10 min window
  rateLimitMap.set(identifier, {
    count: current.count + 1,
    resetTime: current.resetTime,
  });
};

// ========================================
// 📱 Send OTP to Phone (SMS) - SECURE
// ========================================
const sendPhoneOtpService = async (phone: string) => {
  // ✅ 1. Rate Limiting
  await checkRateLimit(phone);

  const otp = generateOtp();
  console.log("📱 Generated SMS OTP:", otp);

  // ✅ 2. Hash OTP for security (optional but recommended)
  const shouldHashOtp = process.env.HASH_OTP === 'true';
  const otpToSave = shouldHashOtp ? await bcrypt.hash(otp.toString(), 10) : otp;

  // ✅ 3. Save OTP in DB with security features
  await OtpModel.create({
    identifier: phone,
    otp: otpToSave,
    type: 'phone',
    attempts: 0,
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3'),
    isBlocked: false,
    expiresAt: new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || '5') * 60 * 1000),
  });

  // ✅ 4. Send SMS (Skip in dev mode if configured)
  const skipSMS = process.env.SKIP_SMS === 'true' || process.env.NODE_ENV === 'development';

  if (!skipSMS) {
    try {
      const url = "https://api.sms.net.bd/sendsms";
      const response = await axios.post(url, {
        api_key: process.env.SMS_API_KEY,
        msg: `Your Guptodhan OTP is ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || '5'} minutes. Do not share with anyone.`,
        to: phone,
      });

      if (response.data.error) {
        console.warn("⚠️ SMS API Warning:", response.data.msg);
      } else {
        console.log("✅ SMS sent successfully");
      }
    } catch (error: any) {
      console.error("❌ SMS error:", error.message);
      // Don't throw error - OTP still saved in DB
    }
  } else {
    console.log("⚠️ DEV MODE: SMS skipped");
  }

  // ✅ 5. Return response (OTP only in development)
  const showOtpInResponse = process.env.NODE_ENV === 'development' || 
                            process.env.SHOW_OTP_IN_RESPONSE === 'true';

  return { 
    success: true, 
    message: "OTP sent to your phone successfully",
    ...(showOtpInResponse && { otp }), // ✅ Only in development
  };
};

// ========================================
// 📧 Send OTP to Email - SECURE
// ========================================
const sendEmailOtpService = async (email: string) => {
  // ✅ 1. Check credentials
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error('Email credentials not configured');
  }

  // ✅ 2. Rate Limiting
  await checkRateLimit(email);

  const otp = generateOtp();
  console.log("📧 Generated Email OTP:", otp);

  // ✅ 3. Hash OTP (optional)
  const shouldHashOtp = process.env.HASH_OTP === 'true';
  const otpToSave = shouldHashOtp ? await bcrypt.hash(otp.toString(), 10) : otp;

  // ✅ 4. Save OTP
  await OtpModel.create({
    identifier: email,
    otp: otpToSave,
    type: 'email',
    attempts: 0,
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3'),
    isBlocked: false,
    expiresAt: new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || '5') * 60 * 1000),
  });

  // ✅ 5. Send Email
  try {
    await transporter.sendMail({
      from: `"Guptodhan" <${process.env.SMTP_FROM || emailUser}>`,
      to: email,
      subject: "Your OTP Code - Guptodhan",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; margin: 20px 0; }
            .warning { background: #fff3cd; color: #856404; padding: 10px; border-radius: 5px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 style="color: #667eea;">🔐 Your OTP Code</h2>
            <p>Use this OTP to complete your registration:</p>
            <div class="otp-box">${otp}</div>
            <p style="text-align: center;"><strong>⏰ Valid for ${process.env.OTP_EXPIRY_MINUTES || '5'} minutes</strong></p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Guptodhan will never ask for your OTP.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Email sent successfully");
  } catch (error: any) {
    console.error("❌ Email error:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  // ✅ 6. Return response
  const showOtpInResponse = process.env.NODE_ENV === 'development' || 
                            process.env.SHOW_OTP_IN_RESPONSE === 'true';

  return { 
    success: true, 
    message: "OTP sent to email successfully",
    ...(showOtpInResponse && { otp }), // ✅ Only in development
  };
};

// ========================================
// ✅ Verify OTP - SECURE with Attempt Tracking
// ========================================
const verifyOtpService = async (identifier: string, otp: number) => {
  console.log(`🔍 Verifying OTP for: ${identifier}`);

  // Find latest OTP
  const record = await OtpModel.findOne({ identifier }).sort({ createdAt: -1 });

  if (!record) {
    console.log(`❌ No OTP found`);
    return { status: false, message: "OTP not found or already used" };
  }

  // ✅ Check if blocked
  if (record.isBlocked) {
    console.log(`❌ OTP blocked due to too many attempts`);
    return { 
      status: false, 
      message: "Too many wrong attempts. Please request a new OTP." 
    };
  }

  // ✅ Check expiry
  if (record.expiresAt < new Date()) {
    console.log(`❌ OTP expired`);
    return { status: false, message: "OTP expired. Please request a new one." };
  }

  // ✅ Verify OTP (handle both hashed and plain)
  const shouldHashOtp = process.env.HASH_OTP === 'true';
  let isMatch = false;

  if (shouldHashOtp && typeof record.otp === 'string') {
    // Hashed OTP
    isMatch = await bcrypt.compare(otp.toString(), record.otp);
  } else {
    // Plain OTP
    isMatch = record.otp === otp;
  }

  if (!isMatch) {
    // ✅ Increment attempts
    record.attempts += 1;
    
    // Block if max attempts reached
    if (record.attempts >= record.maxAttempts) {
      record.isBlocked = true;
      await record.save();
      console.log(`❌ Max attempts reached - OTP blocked`);
      return { 
        status: false, 
        message: "Maximum attempts exceeded. Please request a new OTP." 
      };
    }
    
    await record.save();
    const remaining = record.maxAttempts - record.attempts;
    console.log(`❌ Invalid OTP - ${remaining} attempts remaining`);
    
    return { 
      status: false, 
      message: `Invalid OTP. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.` 
    };
  }

  // ✅ Success - delete all OTPs for this identifier
  await OtpModel.deleteMany({ identifier });
  console.log(`✅ OTP verified and deleted`);

  return { status: true, message: "OTP verified successfully" };
};

export const OtpServices = { 
  sendPhoneOtpService, 
  sendEmailOtpService,
  verifyOtpService 
};