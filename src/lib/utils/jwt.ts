// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\utils\jwt.ts

import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string,
): string => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);

  return token;
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  // jwt.verify ব্যর্থ হলে একটি এরর থ্রো করবে, তাই সফল ক্ষেত্রে এটি সবসময় JwtPayload হবে।
  const verifiedToken = jwt.verify(token, secret) as JwtPayload;
  return verifiedToken;
};