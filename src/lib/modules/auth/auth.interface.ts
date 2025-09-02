// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\auth\auth.interface.ts

export type TLoginUser = {
  email: string;
  password: string;
};

export type TChangePassword = {
  currentPassword: string;
  newPassword: string;
};