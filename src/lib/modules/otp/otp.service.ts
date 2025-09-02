// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\otp\otp.service.ts

import { User } from '../user/user.model';
import { redisClient, connectRedis } from '@/lib/redis';
import { sendEmail } from '@/lib/utils/email';
import { StatusCodes } from 'http-status-codes';

const sendOtp = async (userId: string) => {
  await connectRedis();

  const user = await User.findById(userId);
  if (!user) { throw new Error('User not found'); }
  if (user.isVerified) { throw new Error('User is already verified'); }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `otp:${user.email}`;

  await redisClient.set(redisKey, otp, { EX: 300 }); // 5 minutes expiration

  await sendEmail({
    to: user.email,
    subject: 'Your Verification Code for Guptodhan',
    template: 'otp.ejs',
    data: { name: user.name, otp: otp },
  });

  return null;
};

const verifyOtp = async (userId: string, otp: string) => {
  await connectRedis();

  const user = await User.findById(userId);
  if (!user) { throw new Error('User not found'); }

  const redisKey = `otp:${user.email}`;
  const storedOtp = await redisClient.get(redisKey);

  if (!storedOtp) { throw new Error('OTP has expired or is invalid. Please request a new one.'); }
  if (storedOtp !== otp) { throw new Error('The OTP you entered is incorrect.'); }

  await User.findByIdAndUpdate(userId, { isVerified: true });
  await redisClient.del(redisKey);

  return null;
};

export const OtpServices = {
  sendOtp,
  verifyOtp,
};