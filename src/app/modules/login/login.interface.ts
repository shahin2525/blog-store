export type TLoginUser = {
  email: string;
  password: string;
};
export type TProfileUpdateData = {
  name?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
};
