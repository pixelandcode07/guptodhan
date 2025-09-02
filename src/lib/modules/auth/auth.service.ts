import { User } from '../user/user.model';
import { TLoginUser, TChangePassword } from './auth.interface';
import { generateToken, verifyToken } from '@/lib/utils/jwt';

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

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
};
