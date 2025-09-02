// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\user\user.controller.ts

import { TUserInput } from './user.interface';
import { UserServices } from './user.service';
import { NextRequest } from 'next/server';

/**
 * @description নতুন ইউজার তৈরি করার জন্য কন্ট্রোলার ফাংশন
 * @param userData - এটি এখন ভ্যালিডেট করা ইউজার ডেটা
 * @returns শুধু ইউজারের ডেটা (অবজেক্ট) রিটার্ন করবে, NextResponse নয়
 */
const createUser = async (userData: TUserInput) => {
  // সার্ভিসকে কল করে মূল কাজটি করা হচ্ছে এবং ফলাফল সরাসরি রিটার্ন করা হচ্ছে
  const user = await UserServices.createUserIntoDB(userData);
  return user;
};

/**
 * @description সকল ইউজারদের তালিকা পাওয়ার জন্য কন্ট্রোলার ফাংশন
 * @param _req NextRequest অবজেক্ট (অব্যবহৃত)
 * @returns ইউজারদের একটি তালিকা
 */
const getAllUsers = async (_req: NextRequest) => {
  const users = await UserServices.getAllUsersFromDB();
  return users;
};

export const UserController = {
  createUser,
  getAllUsers,
};