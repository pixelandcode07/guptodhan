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
      hasPassword: !!password, // ← এটা যোগ করো
    },
  };
};


// vendorLogin service এর ভিতরে এই পরিবর্তনটুকু করুন
const vendorLogin = async (payload: TLoginUser) => {
  const { identifier, password: plainPassword } = payload;

  const isEmail = identifier.includes('@');

  // 🔥 ১. এখানে populate('vendorInfo') যোগ করতে হবে যাতে ভেন্ডর আইডি পাওয়া যায়
  const user = isEmail
    ? await User.findOne({ email: identifier }).select('+password').populate('vendorInfo')
    : await User.findOne({ phoneNumber: identifier }).select('+password').populate('vendorInfo');

  if (!user) throw new Error('Invalid credentials.');
  if (user.role !== 'vendor') throw new Error('Access denied. Vendor account required.');

  // ... (বাকি ভ্যালিডেশন কোড আগের মতোই থাকবে: isActive, password check etc.)
  if (!user.isActive) throw new Error('Your account is not active. Please contact support.');
  if (!user.password) throw new Error('Password not set. Use social login.');

  const isPasswordMatched = await user.isPasswordMatched(plainPassword, user.password);
  if (!isPasswordMatched) throw new Error('Invalid credentials.');

  // ... (Token generation code same as before)
  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(jwtPayload, process.env.JWT_ACCESS_SECRET!, process.env.JWT_ACCESS_EXPIRES_IN!);
  const refreshToken = generateToken(jwtPayload, process.env.JWT_REFRESH_SECRET!, process.env.JWT_REFRESH_EXPIRES_IN!);

  const { password, ...userWithoutPassword } = user.toObject();


  // 🔥 ২. ইউজারের সাথে vendorId রিটার্ন করুন
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
      // vendorId: (userWithoutPassword.vendorInfo as any)?._id || null, 
      vendorId: userWithoutPassword.vendorInfo?._id || null,
      hasPassword: !!password,
    }
  };
};


// ------------------------------------
// --- NEW: VENDOR CHANGE PASSWORD ---
// ------------------------------------
const vendorChangePassword = async (userId: string, payload: TChangePassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user) throw new Error('User not found!');

  // --- VENDOR CHECK ---
  if (user.role !== 'vendor') {
    throw new Error('Access denied. This function is for vendors only.');
  }
  // --- END VENDOR CHECK ---

  if (!user.password) throw new Error('Password not set for this user.');

  const isPasswordMatched = await user.isPasswordMatched(payload.currentPassword, user.password);
  if (!isPasswordMatched) throw new Error('Current password does not match!');

  user.password = payload.newPassword;
  await user.save();
  return null;
};


// ------------------------------------
// --- NEW: VENDOR FORGOT PASSWORD (STEP 1) ---
// ------------------------------------
const vendorSendForgotPasswordOtpToEmail = async (email: string) => {
  await connectRedis();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('No user found with this email address.');
  }

  // --- VENDOR CHECK ---
  if (user.role !== 'vendor') {
    throw new Error('This email is not associated with a vendor account.');
  }
  // --- END VENDOR CHECK ---

  if (!user.email) {
    throw new Error('This user does not have a registered email address.');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `reset-otp:email:${email}`;
  await redisClient.set(redisKey, otp, { EX: 300 }); // 5 min expiry

  await sendEmail({
    to: user.email,
    subject: 'Vendor Password Reset Code',
    template: 'otp.ejs', // একই টেমপ্লেট ব্যবহার করা যাবে
    data: { name: user.name, otp: otp },
  });

  return null;
};

// ------------------------------------
// --- NEW: VENDOR FORGOT PASSWORD (STEP 2) ---
// ------------------------------------


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

  // এখানে userId + type দুটোই দাও
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
  // ১. রিফ্রেশ সিক্রেট কি চেক করা
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshTokenSecret) {
    throw new Error('JWT refresh secret not configured in environment variables.');
  }

  // ২. টোকেনটি ভেরিফাই করা (এটি REFRESH_SECRET দিয়ে হবে)
  let decoded: any;
  try {
    decoded = verifyToken(token, refreshTokenSecret);
  } catch (error) {
    throw new Error('Invalid or expired refresh token. Please login again.');
  }

  // ৩. ডিকোড করা ডেটা থেকে ইউজার আইডি নেওয়া
  const { userId } = decoded;
  if (!userId) {
    throw new Error('Invalid token payload.');
  }

  // ৪. ডাটাবেসে ইউজার আছে কি না এবং একটিভ কি না তা চেক করা
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

  // ৫. নতুন এক্সেস টোকেনের জন্য পেলোড তৈরি
  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  // ৬. নতুন এক্সেস টোকেন জেনারেট করা (এটি ACCESS_SECRET দিয়ে হবে)
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

  // ৭. শুধুমাত্র নতুন এক্সেস টোকেনটি রিটার্ন করা
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
  // এখানে .select('+password') যোগ করা হয়েছে
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new Error('User not found!');
  }

  // এখন এই চেকটি কাজ করবে
  if (user.password) {
    throw new Error('This account already has a password. Please use the "Change Password" feature instead.');
  }

  // নতুন পাসওয়ার্ড সেট করা
  user.password = newPassword;

  // সেভ করার সময় এখন pre-save হুকটি ট্রিগার হবে
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

const sendForgotPasswordOtp = async (identifier: string) => {
  const isEmail = identifier.includes('@');
  
  // Find User
  const user = isEmail
    ? await User.findOne({ email: identifier })
    : await User.findOne({ phoneNumber: identifier });

  if (!user) {
    throw new Error('No account found with this email/phone number.');
  }

  // Send OTP using existing OtpServices
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
    otp: otpResult?.otp // Only in dev mode
  };
};

// 2. Verify OTP & Generate Reset Token
const verifyForgotPasswordOtp = async (identifier: string, otp: string) => {
  const otpNumber = Number(otp);
  if (isNaN(otpNumber)) throw new Error("Invalid OTP format");

  // Verify OTP (Do not delete yet, or delete - depends on flow. Let's verify & delete)
  const verificationResult = await OtpServices.verifyOtpService(identifier, otpNumber, true);

  if (!verificationResult.status) {
    throw new Error(verificationResult.message);
  }

  // Find User Again to get ID
  const isEmail = identifier.includes('@');
  const user = isEmail
    ? await User.findOne({ email: identifier })
    : await User.findOne({ phoneNumber: identifier });

  if (!user) throw new Error('User not found.');

  // Generate Reset Token
  const resetTokenPayload = { userId: user._id.toString(), purpose: 'password-reset' };
  const resetToken = generateToken(resetTokenPayload, process.env.JWT_ACCESS_SECRET!, '10m'); // 10 minutes

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



// --- Reset Password With Token ---
const resetPasswordWithToken = async (token: string, newPassword: string) => {
  let decoded: any;
  try {
    decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
  } catch (error) {
    throw new Error('Invalid or expired reset token');
  }

  const user = await User.findById(decoded.userId);
  if (!user) throw new Error('User not found');

  // Vendor check handled by specific routes if needed, or generic reset works for all roles
  if (decoded.type === 'vendor_password_reset' && user.role !== 'vendor') {
    throw new Error('This token is not valid for vendor accounts');
  }

  user.password = newPassword;
  await user.save();
  return null;
};

const vendorSendRegistrationOtp = async (email: string) => {
  await connectRedis();

  // ১. চেক করা ইমেইল আগে থেকে আছে কি না
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('This email is already registered. Please login.');
  }

  // ২. OTP জেনারেট করা
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `registration-otp:${email}`;
  
  // ৫ মিনিটের জন্য সেভ করা
  await redisClient.set(redisKey, otp, { EX: 300 }); 

  // ৩. ইমেইল পাঠানো
  await sendEmail({
    to: email,
    subject: 'Guptodhan Vendor Registration OTP',
    template: 'otp.ejs', 
    data: { name: 'Future Vendor', otp: otp },
  });

  return null;
};

const registerVendor = async (payload: any, otp: string = '', isByAdmin = false) => {
  try {
    // ✅ Step 1: Connect to Redis (for OTP verification if not admin)
    if (!isByAdmin) {
      await connectRedis();
    }

    // ✅ Step 2: Extract data
    const {
      email,
      name,
      password,
      phoneNumber,
      address,
      businessCategory,
      ...vendorData
    } = payload;

    console.log('📝 Registering vendor:', {
      email,
      name,
      isByAdmin,
      hasOTP: !!otp,
    });

    // ✅ Step 3: Verify OTP if not admin
    if (!isByAdmin) {
      if (!otp) {
        throw new Error('OTP is required for manual registration');
      }

      const redisKey = `registration-otp:${email}`;
      const storedOtp = await redisClient.get(redisKey);

      if (!storedOtp || storedOtp !== otp) {
        throw new Error('Invalid or expired OTP');
      }

      console.log('✅ OTP verified');
    }

    // ✅ Step 4: Check email doesn't exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    console.log('✅ Email not duplicate');

    // ✅ Step 5: Create User (WITHOUT SESSION/TRANSACTION)
    const newUser = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save middleware
      phoneNumber,
      address,
      role: 'vendor',
      isActive: isByAdmin ? true : false,
    });

    console.log('✅ User created:', newUser._id);

    // ✅ Step 6: Create Vendor (WITHOUT SESSION/TRANSACTION)
    try {
      const newVendor = await Vendor.create({
        ...vendorData,
        user: newUser._id,
        businessCategory,
      });

      console.log('✅ Vendor created:', newVendor._id);

      // ✅ Step 7: Update User with Vendor reference
      newUser.vendorInfo = newVendor._id;
      await newUser.save();

      console.log('✅ User updated with vendorInfo');

      // ✅ Step 8: Delete OTP from Redis if not admin
      if (!isByAdmin) {
        const redisKey = `registration-otp:${email}`;
        await redisClient.del(redisKey);
        console.log('✅ OTP deleted from Redis');
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
      console.error('❌ Vendor creation error:', vendorError);

      // ✅ Rollback: Delete user if vendor creation fails
      try {
        await User.findByIdAndDelete(newUser._id);
        console.log('✅ Rolled back: User deleted');
      } catch (deleteError) {
        console.error('⚠️ Error deleting user during rollback:', deleteError);
      }

      throw new Error(`Vendor creation failed: ${vendorError.message}`);
    }
  } catch (error: any) {
    console.error('❌ Registration error:', error.message);
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

  // ❌ Transaction Block Removed to fix VPS Error
  try {
    const userData = {
      name,
      email,
      password,
      phoneNumber,
      address,
      role: 'service-provider',
      isActive: false, // Default inactive until approved
      status: 'pending',
      serviceProviderInfo: providerData,
    };

    // ✅ Direct Database Creation (No Session)
    const newUser = await User.create(userData);

    if (!newUser) {
        throw new Error('Failed to create user.');
    }

    // Delete OTP after successful registration
    await redisClient.del(redisKey);
    
    return newUser;

  } catch (error) {
    // No transaction to abort, just throw the error
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
    // user: userWithoutPassword
    user: {
      ...userWithoutPassword,
      hasPassword: !!password,
    },

  };
};


// ------------------------------------
// --- SERVICE PROVIDER LOGIN ---
// ------------------------------------
const serviceProviderLogin = async (payload: TLoginUser) => {
  const { identifier, password: plainPassword } = payload;

  const isEmail = identifier.includes('@');

  const user = isEmail
    ? await User.isUserExistsByEmail(identifier)
    : await User.isUserExistsByPhone(identifier);

  if (!user) {
    throw new Error('Invalid credentials.');
  }


  // ✅ Role check
  if (user.role !== 'service-provider') {
    throw new Error('Access denied. Service provider account required.');
  }

  // ✅ Account status check
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

  console.log('🟢 PASSWORD MATCHED:', isPasswordMatched);

  if (!isPasswordMatched) {
    throw new Error('Incorrect password!');
  }

  // 🔐 JWT Payload
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

  // ১. ইউজার খুঁজে বের করা (ইমেইল বা ফোন দিয়ে)
  const user = isEmail
    ? await User.findOne({ email: identifier }).select('+password')
    : await User.findOne({ phoneNumber: identifier }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials.');
  }

  // 🔥 ২. এডমিন রোল চেক করা (সবথেকে গুরুত্বপূর্ণ)
  if (user.role !== 'admin') {
    throw new Error('Access denied. Admin privileges required.');
  }

  // ৩. অ্যাকাউন্ট অ্যাক্টিভ কিনা চেক করা
  if (!user.isActive) {
    throw new Error('Your admin account is inactive. Please contact system owner.');
  }

  // ৪. পাসওয়ার্ড চেক করা
  const isPasswordMatched = await user.isPasswordMatched(plainPassword, user.password!);
  if (!isPasswordMatched) {
    throw new Error('Invalid credentials.');
  }

  // ৫. টোকেন জেনারেট করা
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

  // রোল চেক
  if (user.role !== 'service-provider') {
    throw new Error('এই ইমেইলটি সার্ভিস প্রোভাইডার অ্যাকাউন্টের সাথে যুক্ত নয়।');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `sp-reset-otp:email:${email}`;
  await redisClient.set(redisKey, otp, { EX: 300 }); // ৫ মিনিট মেয়াদ

  await sendEmail({
    to: email,
    subject: 'Service Provider Password Reset Code',
    template: 'otp.ejs',
    data: { name: user.name, otp: otp },
  });

  return null;
};

// --- ২. ওটিপি ভেরিফাই করে রিসেট টোকেন দেওয়া ---
const serviceProviderVerifyForgotPasswordOtp = async (email: string, otp: string) => {
  await connectRedis();
  const redisKey = `sp-reset-otp:email:${email}`;
  const storedOtp = await redisClient.get(redisKey);

  if (!storedOtp || storedOtp !== otp) {
    throw new Error('OTP সঠিক নয় অথবা মেয়াদ শেষ হয়ে গেছে।');
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error('ইউজার পাওয়া যায়নি।');

  // একটি সিকিউর রিসেট টোকেন জেনারেট করা
  const resetToken = generateToken(
    { 
      userId: user._id.toString(), 
      type: 'sp_password_reset' 
    },
    process.env.JWT_ACCESS_SECRET!,
    '10m' // ১০ মিনিট মেয়াদ
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
