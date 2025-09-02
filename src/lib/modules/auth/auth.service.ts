// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\auth\auth.service.ts

import { generateToken, verifyToken } from '@/lib/utils/jwt';
import { User } from '../user/user.model';
import { TChangePassword, TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new Error('User not found!');
  }

  // সমাধান: user.password undefined কিনা তা চেক করা হচ্ছে
  if (!user.password) {
    throw new Error('Password not set for this user.');
  }

  const isPasswordMatched = await user.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error('Incorrect password!');
  }

  const jwtPayload = {
    userId: user._id.toString(), // এখন আর এরর আসবে না
    email: user.email,
    role: user.role,
  };

  // সমাধান: .env ভেরিয়েবলগুলো চেক করা হচ্ছে
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
  const { password, ...userWithoutPassword } = user.toObject(); // এখন আর এরর আসবে না

  return { accessToken, refreshToken, user: userWithoutPassword };
};

const refreshToken = async (token: string) => {
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshTokenSecret) { throw new Error('JWT refresh secret not configured'); }
  
  const decoded = verifyToken(token, refreshTokenSecret);

  if (!decoded || !decoded.userId) {
    throw new Error('Invalid refresh token');
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.isDeleted) {
    throw new Error('User not found or has been deleted');
  }

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  const accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
  if (!accessTokenSecret || !accessTokenExpiresIn) { throw new Error('JWT access secret not configured'); }
  
  const accessToken = generateToken(jwtPayload, accessTokenSecret, accessTokenExpiresIn);

  return { accessToken };
};

const changePassword = async (userId: string, payload: TChangePassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) { throw new Error('User not found!'); }

    if (!user.password) { throw new Error('Password not set for this user.'); }

    const isPasswordMatched = await user.isPasswordMatched(payload.currentPassword, user.password);
    if (!isPasswordMatched) { throw new Error('Current password does not match!'); }

    user.password = payload.newPassword;
    await user.save();
    return null;
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
};