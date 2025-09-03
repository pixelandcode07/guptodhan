import { firebaseAdmin } from '@/lib/firebaseAdmin';
import { User } from '../user/user.model';
import { TLoginUser, TChangePassword } from './auth.interface';
import { generateToken, verifyToken } from '@/lib/utils/jwt';
import { connectRedis, redisClient } from '@/lib/redis';
import { sendEmail } from '@/lib/utils/email';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) throw new Error('User not found!');
  if (!user.password) throw new Error('Password not set for this user.');

  const isPasswordMatched = await user.isPasswordMatched(payload.password, user.password);
  if (!isPasswordMatched) throw new Error('Incorrect password!');

  const jwtPayload = { userId: user._id.toString(), email: user.email, role: user.role };

  const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  const accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  const refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;

  if (!accessTokenSecret || !accessTokenExpiresIn || !refreshTokenSecret || !refreshTokenExpiresIn) {
    throw new Error('JWT secret or expiration not configured in .env');
  }

  const accessToken = generateToken(jwtPayload, accessTokenSecret, accessTokenExpiresIn);
  const refreshToken = generateToken(jwtPayload, refreshTokenSecret, refreshTokenExpiresIn);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user.toObject();

  return { accessToken, refreshToken, user: userWithoutPassword };
};

const refreshToken = async (token: string) => {
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshTokenSecret) throw new Error('JWT refresh secret not configured');

  const decoded = verifyToken(token, refreshTokenSecret) as { userId?: string };
  if (!decoded || !decoded.userId) throw new Error('Invalid refresh token');

  const user = await User.findById(decoded.userId);
  if (!user || user.isDeleted) throw new Error('User not found or deleted');

  const jwtPayload = { userId: user._id.toString(), email: user.email, role: user.role };
  const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  const accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
  if (!accessTokenSecret || !accessTokenExpiresIn) throw new Error('JWT access secret not configured');

  const accessToken = generateToken(jwtPayload, accessTokenSecret, accessTokenExpiresIn);
  return { accessToken };
};

const changePassword = async (userId: string, payload: TChangePassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new Error('User not found!');
  if (!user.password) throw new Error('Password not set for this user.');

  const isPasswordMatched = await user.isPasswordMatched(payload.currentPassword, user.password);
  if (!isPasswordMatched) throw new Error('Current password does not match!');

  user.password = payload.newPassword;
  await user.save();
  return null;
};

const setPasswordForSocialLogin = async (userId: string, newPassword: string) => {
    
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found!');
    }


    if (user.password) {
        throw new Error('This account already has a password. Please use the "Change Password" feature instead.');
    }


    user.password = newPassword;
    

    await user.save();

    return null;
};

const sendForgotPasswordOtpToEmail = async (email: string) => {
  await connectRedis();
  const user = await User.findOne({ email });
  if (!user) { throw new Error('No user found with this email address.'); }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `reset-otp:email:${email}`;
  await redisClient.set(redisKey, otp, { EX: 300 }); // 5 minutes expiration

  await sendEmail({
    to: user.email,
    subject: 'Your Password Reset Code',
    template: 'otp.ejs',
    data: { name: user.name, otp: otp },
  });
  
  return null;
};

/**
 * @description ইমেইল থেকে পাওয়া OTP ভেরিফাই করে একটি রিসেট টোকেন তৈরি করে
 */
const verifyForgotPasswordOtpFromEmail = async (email: string, otp: string) => {
    await connectRedis();
    const redisKey = `reset-otp:email:${email}`;
    const storedOtp = await redisClient.get(redisKey);

    if (!storedOtp || storedOtp !== otp) {
        throw new Error('OTP is invalid or has expired.');
    }

    const user = await User.findOne({ email });
    if (!user) { throw new Error('User not found.'); }
    
    const resetTokenPayload = { userId: user._id.toString(), purpose: 'password-reset' };
    const resetToken = generateToken(resetTokenPayload, process.env.JWT_ACCESS_SECRET!, '10m'); // 10 minutes validity

    await redisClient.del(redisKey);
    return { resetToken };
};

/**
 * @description Firebase idToken ভেরিফাই করে একটি রিসেট টোকেন তৈরি করে
 */
const getResetTokenWithFirebase = async (idToken: string) => {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const phoneNumberFromFirebase = decodedToken.phone_number;
    if (!phoneNumberFromFirebase) { throw new Error('No phone number found in Firebase token.'); }
  
    const localPhoneNumber = phoneNumberFromFirebase.substring(3);

    const user = await User.findOne({ phoneNumber: localPhoneNumber });
    if (!user) { throw new Error('User with this phone number not found in our database.'); }

    const resetTokenPayload = { userId: user._id.toString(), purpose: 'password-reset' };
    const resetToken = generateToken(resetTokenPayload, process.env.JWT_ACCESS_SECRET!, '10m');

    return { resetToken };
};


/**
 * @description রিসেট টোকেন ব্যবহার করে নতুন পাসওয়ার্ড সেট করে
 */
const resetPasswordWithToken = async (token: string, newPassword: string) => {
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
    if (!decoded.userId || decoded.purpose !== 'password-reset') {
        throw new Error('Invalid or unauthorized token for password reset.');
    }

    const user = await User.findById(decoded.userId);
    if (!user) { throw new Error('User not found.'); }

    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    return null;
};



export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  setPasswordForSocialLogin,
  sendForgotPasswordOtpToEmail,
  verifyForgotPasswordOtpFromEmail,
  getResetTokenWithFirebase,
  resetPasswordWithToken,
};
