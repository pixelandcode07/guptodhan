import axios from "axios";
import nodemailer from "nodemailer";
import { OtpModel } from "./otp.model";

// ========================================
// 📧 Email Configuration (Using SMTP variables)
// ========================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "465"),
  secure: true, // true for port 465, false for 587
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
// 📱 Send OTP to Phone (SMS)
// ========================================
const sendPhoneOtpService = async (phone: string) => {
  const otp = generateOtp();
  console.log("📱 Generated SMS OTP:", otp);

  // Save OTP in DB
  await OtpModel.create({
    identifier: phone,
    otp,
    type: 'phone',
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  });

  // Send SMS via SMS.NET.BD
  const url = "https://api.sms.net.bd/sendsms";
  const response = await axios.post(url, {
    api_key: process.env.SMS_API_KEY || "IGqczqjT94Ts80X2IC82j3J96bVn8hD42F5cD0n9",
    msg: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    to: phone,
  });

  console.log("✅ SMS API Response:", response.data);
  return { 
    success: true, 
    message: "OTP sent to phone successfully",
    otp: process.env.NODE_ENV === 'development' ? otp : undefined
  };
};

// ========================================
// 📧 Send OTP to Email
// ========================================
const sendEmailOtpService = async (email: string) => {
  // ✅ Check if credentials exist
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error('❌ Email credentials missing!');
    console.log('SMTP_USER:', emailUser ? '✅ Set' : '❌ Missing');
    console.log('SMTP_PASS:', emailPass ? '✅ Set' : '❌ Missing');
    throw new Error('Email credentials not configured. Please check SMTP_USER and SMTP_PASS in .env.local');
  }

  const otp = generateOtp();
  console.log("📧 Generated Email OTP:", otp);

  // Save OTP in DB
  await OtpModel.create({
    identifier: email,
    otp,
    type: 'email',
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  });

  // Send Email
  try {
    const info = await transporter.sendMail({
      from: `"Guptodhan" <${process.env.SMTP_FROM || emailUser}>`,
      to: email,
      subject: "Your OTP Code - Guptodhan",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background-color: #f4f4f4; 
              padding: 20px; 
              margin: 0;
            }
            .container { 
              background: white; 
              padding: 30px; 
              border-radius: 10px; 
              max-width: 500px; 
              margin: 0 auto; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .otp-box { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px; 
              text-align: center; 
              font-size: 32px; 
              font-weight: bold; 
              letter-spacing: 8px; 
              border-radius: 8px; 
              margin: 20px 0; 
            }
            .footer { 
              color: #888; 
              font-size: 12px; 
              margin-top: 20px; 
              text-align: center;
              border-top: 1px solid #eee;
              padding-top: 15px;
            }
            .warning {
              background: #fff3cd;
              color: #856404;
              padding: 10px;
              border-radius: 5px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="color: #667eea; margin: 0;">🔐 Your OTP Code</h2>
            </div>
            <p>Hello,</p>
            <p>Use this OTP to complete your registration on <strong>Guptodhan</strong>:</p>
            <div class="otp-box">${otp}</div>
            <p style="text-align: center;"><strong>⏰ This code will expire in 5 minutes.</strong></p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Guptodhan will never ask for your OTP via phone or email.
            </div>
            <div class="footer">
              <p>If you didn't request this code, please ignore this email.</p>
              <p>© ${new Date().getFullYear()} Guptodhan. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Email OTP sent successfully");
    console.log("Message ID:", info.messageId);
  } catch (error: any) {
    console.error("❌ Email sending error:", error);
    throw new Error(`Failed to send email OTP: ${error.message}`);
  }

  return { 
    success: true, 
    message: "OTP sent to email successfully",
    otp: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production' ? otp : undefined
  };
};

// ========================================
// ✅ Verify OTP (Works for both Email & Phone)
// ========================================
const verifyOtpService = async (identifier: string, otp: number) => {
  // Find the latest OTP for this identifier
  const record = await OtpModel.findOne({ identifier }).sort({ createdAt: -1 });

  if (!record) {
    return { status: false, message: "OTP not found" };
  }

  if (record.expiresAt < new Date()) {
    return { status: false, message: "OTP expired" };
  }

  if (record.otp !== otp) {
    return { status: false, message: "Invalid OTP" };
  }

  // Delete all OTPs for this identifier after successful verification
  await OtpModel.deleteMany({ identifier });

  return { status: true, message: "OTP verified successfully" };
};

export const OtpServices = { 
  sendPhoneOtpService, 
  sendEmailOtpService,
  verifyOtpService 
};