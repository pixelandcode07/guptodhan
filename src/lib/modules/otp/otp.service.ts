import axios from "axios";
import { OtpModel } from "./otp.model";

export const sendOtpService = async (phone: string) => {
  // -----------------------------
  // Generate 6-digit OTP
  // -----------------------------
  const generateOtp = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const otp = generateOtp();

  console.log("Generated OTP:", otp);

  // -----------------------------
  // Save OTP in DB
  // -----------------------------
  await OtpModel.insertOne({
    phone,
    otp,
    // expiresAt: new Date(Date.now() + env.OTP_EXPIRE_MINUTES * 60 * 1000),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry for demo
  });

  // -----------------------------
  // Call SMS.NET.BD API
  // -----------------------------
  const url = "https://api.sms.net.bd/sendsms";

  const response = await axios.post(url, {
    // api_key: env.SMS_API_KEY,
    api_key: "IGqczqjT94Ts80X2IC82j3J96bVn8hD42F5cD0n9",
    // msg: `Your OTP is ${otp}. It will expire in ${env.OTP_EXPIRE_MINUTES} minutes.`,
    msg: `Your OTP is ${otp}. It will expire in ${5} minutes.`,
    to: phone,
  });


  console.log("SMS API Response:", response.data);
  console.log("data send to sms.net.bd");
  return response.data; // Return API response
  // return 'response.data';
};

const verifyOtpService = async (phone: string, otp: number) => {
  const record = await OtpModel.findOne({ phone }).sort({ createdAt: -1 });

  if (!record) return { status: false, message: "OTP not found" };
  if (record.expiresAt < new Date()) return { status: false, message: "OTP expired" };
  if (record.otp !== otp) return { status: false, message: "Invalid OTP" };

  await OtpModel.deleteMany({ phone });

  return { status: true };
};


export const OtpServices = { sendOtpService, verifyOtpService };
