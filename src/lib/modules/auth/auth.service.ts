/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import { TChangePassword, TLoginUser } from './auth.interface';
import { generateToken, verifyToken } from '@/lib/utils/jwt';
import { connectRedis, redisClient } from '@/lib/redis';
import { sendEmail } from '@/lib/utils/email';
import mongoose from 'mongoose';
import { ServiceProvider } from '../service-provider/serviceProvider.model';
import bcrypt from 'bcrypt';
import { User } from '../user/user.model';
import { verifyGoogleToken } from '@/lib/utils/verifyGoogleToken';
import { Vendor } from '../vendors/vendor.model';
import { OtpServices } from '../otp/otp.service';
import { createAdminNotification } from '@/lib/utils/createAdminNotification';

const loginUser = async (payload: TLoginUser) => {
  const { identifier, password: plainPassword } = payload;

  const isEmail = identifier.includes('@');

  const user = isEmail
    ? await User.isUserExistsByEmail(identifier)
    : await User.isUserExistsByPhone(identifier);

  if (!user) {
    throw new Error('User not found!');
  }

  if (!user.isActive) {
    throw new Error('Your account is inactive or pending approval.');
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user.toObject();

  return {
    accessToken,
    refreshToken,
    user: {
      ...userWithoutPassword,
      hasPassword: !!password,
    },
  };
};

// vendorLogin service 
const vendorLogin = async (payload: TLoginUser) => {
  const { identifier, password: plainPassword } = payload;

  const isEmail = identifier.includes('@');

  const user = isEmail
    ? await User.findOne({ email: identifier }).select('+password').populate('vendorInfo')
    : await User.findOne({ phoneNumber: identifier }).select('+password').populate('vendorInfo');

  if (!user) throw new Error('Invalid credentials.');
  if (user.role !== 'vendor') throw new Error('Access denied. Vendor account required.');

  if (!user.isActive) throw new Error('Your account is not active. Please contact support.');
  if (!user.password) throw new Error('Password not set. Use social login.');

  const isPasswordMatched = await user.isPasswordMatched(plainPassword, user.password);
  if (!isPasswordMatched) throw new Error('Invalid credentials.');

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(jwtPayload, process.env.JWT_ACCESS_SECRET!, process.env.JWT_ACCESS_EXPIRES_IN!);
  const refreshToken = generateToken(jwtPayload, process.env.JWT_REFRESH_SECRET!, process.env.JWT_REFRESH_EXPIRES_IN!);

  const { password, ...userWithoutPassword } = user.toObject();

  return {
    accessToken,
    refreshToken,
    user: {
      _id: userWithoutPassword._id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      phoneNumber: userWithoutPassword.phoneNumber,
      role: userWithoutPassword.role,
      profilePicture: userWithoutPassword.profilePicture,
      address: userWithoutPassword.address,
      isActive: userWithoutPassword.isActive,
      vendorId: userWithoutPassword.vendorInfo?._id || null,
      hasPassword: !!password,
    }
  };
};

const vendorChangePassword = async (userId: string, payload: TChangePassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user) throw new Error('User not found!');

  if (user.role !== 'vendor') {
    throw new Error('Access denied. This function is for vendors only.');
  }

  if (!user.password) throw new Error('Password not set for this user.');

  const isPasswordMatched = await user.isPasswordMatched(payload.currentPassword, user.password);
  if (!isPasswordMatched) throw new Error('Current password does not match!');

  user.password = payload.newPassword;
  await user.save();
  return null;
};

const vendorSendForgotPasswordOtpToEmail = async (email: string) => {
  await connectRedis();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('No user found with this email address.');
  }

  if (user.role !== 'vendor') {
    throw new Error('This email is not associated with a vendor account.');
  }

  if (!user.email) {
    throw new Error('This user does not have a registered email address.');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `reset-otp:email:${email}`;
  await redisClient.set(redisKey, otp, { EX: 300 });

  await sendEmail({
    to: user.email,
    subject: 'Vendor Password Reset Code',
    template: 'otp.ejs', 
    data: { name: user.name, otp: otp },
  });

  return null;
};

const vendorVerifyForgotPasswordOtpFromEmail = async (email: string, otp: string) => {
  await connectRedis();
  const redisKey = `reset-otp:email:${email}`;
  const storedOtp = await redisClient.get(redisKey);

  if (!storedOtp || storedOtp !== otp) {
    throw new Error('OTP is invalid or has expired.');
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found.');
  if (user.role !== 'vendor') throw new Error('This email is not associated with a vendor account.');

  const resetToken = generateToken(
    {
      userId: user._id.toString(),
      type: 'vendor_password_reset'
    },
    process.env.JWT_ACCESS_SECRET!,
    '10m'
  );

  await redisClient.del(redisKey);
  return { resetToken };
};

const refreshToken = async (token: string) => {
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshTokenSecret) {
    throw new Error('JWT refresh secret not configured in environment variables.');
  }

  let decoded: any;
  try {
    decoded = verifyToken(token, refreshTokenSecret);
  } catch (error) {
    throw new Error('Invalid or expired refresh token. Please login again.');
  }

  const { userId } = decoded;
  if (!userId) {
    throw new Error('Invalid token payload.');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found!');
  }

  if (user.isDeleted) {
    throw new Error('This account has been deleted.');
  }

  if (!user.isActive) {
    throw new Error('User account is inactive.');
  }

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  const accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;

  if (!accessTokenSecret || !accessTokenExpiresIn) {
    throw new Error('JWT access configuration missing.');
  }

  const accessToken = generateToken(
    jwtPayload,
    accessTokenSecret,
    accessTokenExpiresIn
  );

  return {
    accessToken,
  };
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
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new Error('User not found!');
  }

  if (user.password) {
    throw new Error('This account already has a password. Please use the "Change Password" feature instead.');
  }

  user.password = newPassword;
  user.hasPassword = true;

  await user.save();

  return null;
};

const sendForgotPasswordOtpToEmail = async (email: string) => {
  await connectRedis();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('No user found with this email address.');
  }

  if (!user.email) {
    throw new Error('This user does not have a registered email address.');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `reset-otp:email:${email}`;
  await redisClient.set(redisKey, otp, { EX: 300 });

  await sendEmail({
    to: user.email, 
    subject: 'Your Password Reset Code',
    template: 'otp.ejs',
    data: { name: user.name, otp: otp },
  });

  return null;
};

const sendForgotPasswordOtp = async (identifier: string) => {
  const isEmail = identifier.includes('@');
  
  const user = isEmail
    ? await User.findOne({ email: identifier })
    : await User.findOne({ phoneNumber: identifier });

  if (!user) {
    throw new Error('No account found with this email/phone number.');
  }

  let otpResult;
  if (isEmail) {
    if (!user.email) throw new Error("User has no email attached.");
    otpResult = await OtpServices.sendEmailOtpService(user.email);
  } else {
    if (!user.phoneNumber) throw new Error("User has no phone number attached.");
    otpResult = await OtpServices.sendPhoneOtpService(user.phoneNumber);
  }

  return { 
    type: isEmail ? 'email' : 'phone',
    otp: otpResult?.otp 
  };
};

const verifyForgotPasswordOtp = async (identifier: string, otp: string) => {
  const otpNumber = Number(otp);
  if (isNaN(otpNumber)) throw new Error("Invalid OTP format");

  const verificationResult = await OtpServices.verifyOtpService(identifier, otpNumber, true);

  if (!verificationResult.status) {
    throw new Error(verificationResult.message);
  }

  const isEmail = identifier.includes('@');
  const user = isEmail
    ? await User.findOne({ email: identifier })
    : await User.findOne({ phoneNumber: identifier });

  if (!user) throw new Error('User not found.');

  const resetTokenPayload = { userId: user._id.toString(), purpose: 'password-reset' };
  const resetToken = generateToken(resetTokenPayload, process.env.JWT_ACCESS_SECRET!, '10m');

  return { resetToken };
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
  const resetToken = generateToken(resetTokenPayload, process.env.JWT_ACCESS_SECRET!, '10m'); 

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
  let decoded: any;
  try {
    decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
  } catch (error) {
    throw new Error('Invalid or expired reset token');
  }

  const user = await User.findById(decoded.userId);
  if (!user) throw new Error('User not found');

  if (decoded.type === 'vendor_password_reset' && user.role !== 'vendor') {
    throw new Error('This token is not valid for vendor accounts');
  }

  user.password = newPassword;
  await user.save();
  return null;
};

const vendorSendRegistrationOtp = async (email: string) => {
  await connectRedis();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('This email is already registered. Please login.');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `registration-otp:${email}`;
  
  await redisClient.set(redisKey, otp, { EX: 300 }); 

  await sendEmail({
    to: email,
    subject: 'Guptodhan Vendor Registration OTP',
    template: 'otp.ejs', 
    data: { name: 'Future Vendor', otp: otp },
  });

  return null;
};

export const registerVendor = async (payload: any, otp: string = '', isByAdmin = false) => {
  try {
    if (!isByAdmin) {
      await connectRedis();
    }

    const {
      email,
      name,
      password,
      phoneNumber,
      address,
      businessCategory,
      ...vendorData
    } = payload;

    if (!isByAdmin) {
      if (!otp) {
        throw new Error('OTP is required for manual registration');
      }

      const redisKey = `registration-otp:${email}`;
      const storedOtp = await redisClient.get(redisKey);

      if (!storedOtp || storedOtp !== otp) {
        throw new Error('Invalid or expired OTP');
      }
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new Error('This Email address is already registered');
    }

    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      throw new Error('This Phone number is already registered');
    }

    const newUser = await User.create({
      name,
      email,
      password, 
      hasPassword: true, // ✅ MAGIC FIX: ADDED THIS
      phoneNumber,
      address,
      role: 'vendor',
      isActive: isByAdmin ? true : false,
    });

    try {
      const newVendor = await Vendor.create({
        ...vendorData,
        user: newUser._id,
        businessCategory,
      });

      newUser.vendorInfo = newVendor._id;
      await newUser.save();

      if (!isByAdmin) {
        const redisKey = `registration-otp:${email}`;
        await redisClient.del(redisKey);
      }

      if (!isByAdmin) {
        await createAdminNotification(
          'vendor_request',
          `New Vendor Registration Request from ${newUser.name}`,
          `/dashboard/admin/users`
        );
      }

      return {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        vendorInfo: newVendor._id,
        status: newVendor.status,
      };
    } catch (vendorError: any) {
      try {
        await User.findByIdAndDelete(newUser._id);
      } catch (deleteError) {
        console.error('⚠️ Error deleting user during rollback:', deleteError);
      }
      throw new Error(`Vendor creation failed: ${vendorError.message}`);
    }
  } catch (error: any) {
    if (error.code === 11000) {
      if (error.keyPattern?.phoneNumber) {
        throw new Error('This Phone number is already registered');
      }
      if (error.keyPattern?.email) {
        throw new Error('This Email address is already registered');
      }
    }
    throw error;
  }
};

const serviceProviderSendRegistrationOtp = async (email: string) => {
  await connectRedis();

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('এই ইমেইলটি ইতিমধ্যে ব্যবহার করা হয়েছে।');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `sp-registration-otp:${email}`; 
  
  await redisClient.set(redisKey, otp, { EX: 300 });

  await sendEmail({
    to: email,
    subject: 'Service Provider Registration OTP',
    template: 'otp.ejs',
    data: { name: 'Service Provider', otp: otp },
  });
  return null;
};

const registerServiceProvider = async (payload: any, otp: string) => {
  await connectRedis();
  const { email, name, password, phoneNumber, address, ...providerData } = payload;

  const redisKey = `sp-registration-otp:${email}`;
  const storedOtp = await redisClient.get(redisKey);

  if (!storedOtp || storedOtp !== otp) {
    throw new Error('Invalid OTP or OTP has expired.');
  }

  try {
    const userData = {
      name,
      email,
      password,
      hasPassword: true, // ✅ MAGIC FIX: ADDED THIS
      phoneNumber,
      address,
      role: 'service-provider',
      isActive: false, 
      status: 'pending',
      serviceProviderInfo: providerData,
    };

    const newUser = await User.create(userData);

    if (!newUser) {
        throw new Error('Failed to create user.');
    }

    await redisClient.del(redisKey);
    
    await createAdminNotification(
      'service_request',
      `New Service Provider Registration Request from ${newUser.name}`,
      `/general/all-provider-request`
    );
    
    return newUser;

  } catch (error) {
    throw error;
  }
};

const loginWithGoogle = async (idToken: string) => {
  const payload = await verifyGoogleToken(idToken);

  const { email, name, picture } = payload!;
  if (!email) throw new Error("Google account has no verified email.");

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: name || "Google User",
      email,
      profilePicture: picture || "",
      role: "user",
      isVerified: true,
      isActive: true,
      address: "N/A",
    });
  }

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET!,
    process.env.JWT_ACCESS_EXPIRES_IN!
  );
  const refreshToken = generateToken(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET!,
    process.env.JWT_REFRESH_EXPIRES_IN!
  );

  const { password, ...userWithoutPassword } = user.toObject();
  return {
    accessToken,
    refreshToken,
    user: {
       ...user.toObject(),
      hasPassword: !!password,
    },
  };
};

const serviceProviderLogin = async (payload: TLoginUser) => {
  const { identifier, password: plainPassword } = payload;

  const isEmail = identifier.includes('@');

  const user = isEmail
    ? await User.isUserExistsByEmail(identifier)
    : await User.isUserExistsByPhone(identifier);

  if (!user) {
    throw new Error('Invalid credentials.');
  }

  if (user.role !== 'service-provider') {
    throw new Error('Access denied. Service provider account required.');
  }

  if (!user.isActive) {
    throw new Error('Your account is inactive. Please contact support.');
  }

  if (!user.password) {
    throw new Error('Password not set. Please use social login.');
  }

  const isPasswordMatched = await user.isPasswordMatched(
    plainPassword,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error('Incorrect password!');
  }

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET!,
    process.env.JWT_ACCESS_EXPIRES_IN!
  );

  const refreshToken = generateToken(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET!,
    process.env.JWT_REFRESH_EXPIRES_IN!
  );

  const { password, ...userWithoutPassword } = user.toObject();

  return {
    accessToken,
    refreshToken,
    user: {
      _id: userWithoutPassword._id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      phoneNumber: userWithoutPassword.phoneNumber,
      role: userWithoutPassword.role,
      profilePicture: userWithoutPassword.profilePicture,
      address: userWithoutPassword.address,
      serviceProviderInfo: userWithoutPassword.serviceProviderInfo || null,
    },
  };
};

const adminLogin = async (payload: TLoginUser) => {
  const { identifier, password: plainPassword } = payload;

  const isEmail = identifier.includes('@');

  const user = isEmail
    ? await User.findOne({ email: identifier }).select('+password')
    : await User.findOne({ phoneNumber: identifier }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials.');
  }

  if (user.role !== 'admin') {
    throw new Error('Access denied. Admin privileges required.');
  }

  if (!user.isActive) {
    throw new Error('Your admin account is inactive. Please contact system owner.');
  }

  const isPasswordMatched = await user.isPasswordMatched(plainPassword, user.password!);
  if (!isPasswordMatched) {
    throw new Error('Invalid credentials.');
  }

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET!,
    process.env.JWT_ACCESS_EXPIRES_IN!
  );

  const refreshToken = generateToken(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET!,
    process.env.JWT_REFRESH_EXPIRES_IN!
  );

  const { password, ...userWithoutPassword } = user.toObject();

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const serviceProviderSendForgotPasswordOtp = async (email: string) => {
  await connectRedis();

  const user = await User.findOne({ email });
  if (!user) throw new Error('এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।');

  if (user.role !== 'service-provider') {
    throw new Error('এই ইমেইলটি সার্ভিস প্রোভাইডার অ্যাকাউন্টের সাথে যুক্ত নয়।');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `sp-reset-otp:email:${email}`;
  await redisClient.set(redisKey, otp, { EX: 300 }); 

  await sendEmail({
    to: email,
    subject: 'Service Provider Password Reset Code',
    template: 'otp.ejs',
    data: { name: user.name, otp: otp },
  });

  return null;
};

const serviceProviderVerifyForgotPasswordOtp = async (email: string, otp: string) => {
  await connectRedis();
  const redisKey = `sp-reset-otp:email:${email}`;
  const storedOtp = await redisClient.get(redisKey);

  if (!storedOtp || storedOtp !== otp) {
    throw new Error('OTP সঠিক নয় অথবা মেয়াদ শেষ হয়ে গেছে।');
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error('ইউজার পাওয়া যায়নি।');

  const resetToken = generateToken(
    { 
      userId: user._id.toString(), 
      type: 'sp_password_reset' 
    },
    process.env.JWT_ACCESS_SECRET!,
    '10m' 
  );

  await redisClient.del(redisKey);
  return { resetToken };
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
  serviceProviderSendRegistrationOtp,
  registerServiceProvider,
  serviceProviderLogin,
  loginWithGoogle,
  vendorLogin,
  vendorChangePassword,
  vendorSendForgotPasswordOtpToEmail,
  vendorVerifyForgotPasswordOtpFromEmail,
  vendorSendRegistrationOtp,
  serviceProviderSendForgotPasswordOtp,
  serviceProviderVerifyForgotPasswordOtp,
  adminLogin,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
};