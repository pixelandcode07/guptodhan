export type TLoginUser = {
  identifier: string;
  password: string;
};

export type TChangePassword = {
  currentPassword: string;
  newPassword: string;
};