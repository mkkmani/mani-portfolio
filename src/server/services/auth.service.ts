import { sign } from "jsonwebtoken";
import { ENV } from "@/config/env";
import User, { IUser } from "@/server/models/user.model";
import { LoginInput, RegisterInput } from "@/server/validators/auth.validator";

type UserWithoutPassword = Omit<IUser, "password"> & {
  _id: string;
  toObject: () => any;
};

type AuthResponse = {
  user: UserWithoutPassword;
  token: string;
};

const generateToken = (userId: string): string => {
  return sign({ id: userId }, ENV.JWT_SECRET, {
    expiresIn: "2d",
  });
};

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const user = (await User.create({
    email: input.email,
    password: input.password,
    role: "admin",
  })) as unknown as UserWithoutPassword;

  const token = generateToken(user._id.toString());

  const userObject = user.toObject();
  delete userObject.password;

  return { user: userObject, token };
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = (await User.findOne({ email: input.email }).select(
    "+password"
  )) as unknown as IUser & { _id: any };
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(input.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id.toString());

  const userObject = user.toObject() as any;
  delete userObject.password;

  return { user: userObject, token };
};

export const getCurrentUser = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).select("-password");
};
