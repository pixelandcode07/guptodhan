// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\auth\auth.interface.ts

export type TLoginUser = {
  // সমাধান: email-এর পরিবর্তে identifier, যা ইমেইল বা ফোন নম্বর হতে পারে
  identifier: string;
  password: string;
};

export type TChangePassword = {
  currentPassword: string;
  newPassword: string;
};