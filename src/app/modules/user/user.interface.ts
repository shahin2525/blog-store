export type TUser = {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isBlocked: boolean;
};
