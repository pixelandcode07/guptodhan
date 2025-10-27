/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import {  TChangePassword, TLoginUser } from './auth.interface';
import { generateToken, verifyToken } from '@/lib/utils/jwt';
import { connectRedis, redisClient } from '@/lib/redis';
import { sendEmail } from '@/lib/utils/email';
import mongoose from 'mongoose';
import { Vendor } from '../vendor/vendor.model';
import { ServiceProvider } from '../service-provider/serviceProvider.model';
import { User } from '../user/user.model';






const loginUser = async (payload: TLoginUser) => {
  const { identifier, password: plainPassword } = payload; // সমাধান ১: password-কে plainPassword নামকরণ করা হয়েছে

  const isEmail = identifier.includes('@');
  
  const user = isEmail
    ? await User.isUserExistsByEmail(identifier)
    : await User.isUserExistsByPhone(identifier);

  if (!user) {
    throw new Error('User not found!');
  }

  if (!user.password) {
    throw new Error('Password not set for this user. Please try social login.');
  }

  const isPasswordMatched = await user.isPasswordMatched(
    plainPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error('Incorrect password!');
  }

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  const accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  const refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;

  if (!accessTokenSecret || !accessTokenExpiresIn || !refreshTokenSecret || !refreshTokenExpiresIn) {
    throw new Error('JWT secret or expiration not configured in .env.local file');
  }

  const accessToken = generateToken(jwtPayload, accessTokenSecret, accessTokenExpiresIn);
  const refreshToken = generateToken(jwtPayload, refreshTokenSecret, refreshTokenExpiresIn);

  // সমাধান ২: এখানে password ডিস্ট্রাকচার করার আর কোনো দ্বন্দ্ব নেই
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

// --- শুধুমাত্র ইমেইলের জন্য: Forgot Password এর জন্য OTP পাঠানোর সার্ভিস ---
const sendForgotPasswordOtpToEmail = async (email: string) => {
  await connectRedis();
  
  const user = await User.findOne({ email });
  if (!user) { 
    throw new Error('No user found with this email address.'); 
  }

  // সমাধান: sendEmail কল করার আগে নিশ্চিত করা হচ্ছে যে user.email আছে
  if (!user.email) {
    throw new Error('This user does not have a registered email address.');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `reset-otp:email:${email}`;
  await redisClient.set(redisKey, otp, { EX: 300 });

  await sendEmail({
    to: user.email, // এখন TypeScript নিশ্চিত যে এটি একটি string
    subject: 'Your Password Reset Code',
    template: 'otp.ejs',
    data: { name: user.name, otp: otp },
  });
  
  return null;
};


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


const registerVendor = async (payload: any) => {
  const { name, email, password, phoneNumber, address, ...vendorData } = payload;
  const userData = { name, email, password, phoneNumber, address, role: 'vendor' };

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newUser = (await User.create([userData], { session }))[0];
    if (!newUser) { throw new Error('Failed to create user'); }

    vendorData.user = newUser._id;
    const newVendor = (await Vendor.create([vendorData], { session }))[0];
    if (!newVendor) { throw new Error('Failed to create vendor profile'); }

    newUser.vendorInfo = newVendor._id;
    await newUser.save({ session });

    await session.commitTransaction();
    return newUser;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const registerServiceProvider = async (payload: any) => {
  const { 
    name, 
    email, 
    password, 
    phoneNumber, 
    address, 
    // The rest of the payload contains the service provider info
    ...providerData 
  } = payload;

  // ✅ FIX: Add the providerData directly to the user object
  const userData = { 
    name, 
    email, 
    password, 
    phoneNumber, 
    address, 
    role: 'service-provider',
    serviceProviderInfo: providerData // Embed the service data directly as defined in your schema
  };

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Create the user with the embedded info
    const newUser = (await User.create([userData], { session }))[0];
    if (!newUser) { throw new Error('Failed to create user'); }

    // ❗ REMOVED: No need to create a separate ServiceProvider document
    // ❗ REMOVED: The line that was causing the error (newUser.serviceProviderInfo = newProvider._id;)

    await session.commitTransaction();
    return newUser;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const loginWithGoogle = async (idToken: string) => {
  let decodedToken;
  try {
    decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
  } catch (error) {
    throw new Error('Invalid Google ID Token. Please try again.');
  }

  const { email, name, picture } = decodedToken;

  if (!email) {
    throw new Error('Google account does not have a verified email.');
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: name || 'Google User',
      email: email,
      profilePicture: picture || '',
      role: 'user',
      isVerified: true, 
      isActive: true,
      address: 'N/A', 
    });
  }

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  const accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  const refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;

  if (!accessTokenSecret || !accessTokenExpiresIn || !refreshTokenSecret || !refreshTokenExpiresIn) {
    throw new Error('JWT configuration is missing.');
  }

  const accessToken = generateToken(jwtPayload, accessTokenSecret, accessTokenExpiresIn);
  const refreshToken = generateToken(jwtPayload, refreshTokenSecret, refreshTokenExpiresIn);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user.toObject();

  return { accessToken, refreshToken, user: userWithoutPassword };
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
  registerVendor,
  registerServiceProvider,
  loginWithGoogle,
};
