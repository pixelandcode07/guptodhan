import { OtpModel } from './otp.model';

// ৬ ডিজিটের রেন্ডম OTP জেনারেট করার ফাংশন
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// ========================================
// 📱 Send OTP to Phone
// ========================================
const sendPhoneOtpService = async (phone: string) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60000); // OTP 5 মিনিট ভ্যালিড থাকবে

  // ডাটাবেসে সেভ করা
  await OtpModel.create({
    identifier: phone,
    otp,
    type: 'phone',
    expiresAt,
  });

  // ⚠️ এখানে আপনার SMS Gateway এর API বসাবেন (যেমন: Bytfize, SSLWireless, BulkSMS)
  console.log(`📱 SMS Sent: Your Guptodhan OTP is ${otp} for phone ${phone}`);

  // ডেভেলপমেন্টের সুবিধার জন্য OTP রিটার্ন করা হলো (প্রোডাকশনে OTP রিটার্ন করবেন না)
  return { success: true, message: 'SMS sent successfully', demoOtp: otp };
};

// ========================================
// 📧 Send OTP to Email
// ========================================
const sendEmailOtpService = async (email: string) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60000); // OTP 5 মিনিট ভ্যালিড থাকবে

  // ডাটাবেসে সেভ করা
  await OtpModel.create({
    identifier: email,
    otp,
    type: 'email',
    expiresAt,
  });

  // ⚠️ এখানে Nodemailer বা SendGrid দিয়ে ইমেইল সেন্ড করার লজিক বসাবেন
  console.log(`📧 Email Sent: Your Guptodhan OTP is ${otp} for email ${email}`);

  return { success: true, message: 'Email sent successfully', demoOtp: otp };
};

// ========================================
// ✅ Verify OTP
// ========================================
const verifyOtpService = async (identifier: string, otpNumber: number, shouldDelete: boolean = true) => {
  // ডাটাবেস থেকে সবচেয়ে লেটেস্ট OTP খুঁজে বের করা
  const record = await OtpModel.findOne({ identifier }).sort({ createdAt: -1 });

  if (!record) {
    return { status: false, message: 'OTP not found or expired' };
  }

  if (record.isBlocked) {
    return { status: false, message: 'Too many failed attempts. Try again later.' };
  }

  // OTP মিলছে কিনা চেক করা
  if (record.otp !== otpNumber) {
    record.attempts += 1;
    
    // ৩ বার ভুল করলে ব্লক করে দেওয়া হবে
    if (record.attempts >= record.maxAttempts) {
      record.isBlocked = true;
      await record.save();
      return { status: false, message: 'Maximum attempts reached. OTP blocked.' };
    }
    
    await record.save();
    return { status: false, message: 'Invalid OTP' };
  }

  // OTP মিলে গেলে এবং shouldDelete true হলে ডাটাবেস থেকে মুছে ফেলা
  if (shouldDelete) {
    await OtpModel.deleteMany({ identifier });
  }

  return { status: true, message: 'OTP verified successfully' };
};

export const OtpServices = {
  sendPhoneOtpService,
  sendEmailOtpService,
  verifyOtpService,
};