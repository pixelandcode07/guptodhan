// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\otp\otp.validation.ts

import { z } from 'zod';

export const verifyOtpValidationSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits long' }),
});