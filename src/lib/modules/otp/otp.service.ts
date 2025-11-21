// import { User } from "../user/user.model";
// import { firebaseAdmin } from "@/lib/firebaseAdmin";

// const verifyPhoneNumberWithFirebase = async (idToken: string) => {
//   try {
//     const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

//     const phoneNumber = decodedToken.phone_number;
//     if (!phoneNumber) throw new Error("No phone number found in token");

//     const localPhoneNumber = phoneNumber.startsWith("+88") ? phoneNumber.slice(3) : phoneNumber;

//     const user = await User.findOne({ phoneNumber: localPhoneNumber });
//     if (!user) throw new Error("User not found in DB");

//     await User.findByIdAndUpdate(user._id, { isVerified: true });

//     return { uid: decodedToken.uid, phoneNumber };
//   } catch (error: any) {
//     console.error("Firebase verifyIdToken error:", error);
//     throw new Error("Unauthorized: Invalid or expired token");
//   }
// };

// export const OtpServices = {
//   verifyPhoneNumberWithFirebase,
// };



import axios from "axios";
import { OtpModel } from "./otp.model";

export const sendOtpService = async (phone: string) => {

  const generateOtp = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
  };
  const otp = generateOtp();

  // Save OTP in DB
  await OtpModel.create({
    phone,
    otp,
    expiresAt: new Date(Date.now() + env.OTP_EXPIRE_MINUTES * 60 * 1000),
  });

  // Call SMS.NET.BD API
  const url = "https://api.sms.net.bd/sendsms";

  const response = await axios.post(url, {
    api_key: env.SMS_API_KEY,
    msg: `Your OTP is ${otp}. It will expire in ${env.OTP_EXPIRE_MINUTES} minutes.`,
    to: phone,
  });

  return response.data;
};

export const verifyOtpService = async (phone: string, otp: number) => {
  const record = await OtpModel.findOne({ phone }).sort({ createdAt: -1 });

  if (!record) return { status: false, message: "OTP not found" };
  if (record.expiresAt < new Date()) return { status: false, message: "OTP expired" };
  if (record.otp !== otp) return { status: false, message: "Invalid OTP" };

  await OtpModel.deleteMany({ phone });

  return { status: true };
};
