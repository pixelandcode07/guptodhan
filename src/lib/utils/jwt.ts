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
  console.log('--- Token to verify ---', token);
  console.log('--- Secret used ---', secret);
  try {
    const verifiedToken = jwt.verify(token, secret) as JwtPayload;
    console.log('--- Decoded token ---', verifiedToken);
    return verifiedToken;
  } catch (error) {
    console.error('--- JWT verification failed ---', error);
    throw error;
  }
};