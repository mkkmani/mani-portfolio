import { NextRequest, NextResponse } from "next/server";
import { validateUser } from "@/server/utils/userValidation";
import User from "@/server/models/User";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "@/server/services/authServices";
import connectToDB from "@/server/db/mongoDb";

export const registerUser = async (req: NextRequest) => {
  const { email, password } = await req.json();
  await connectToDB();
  try {
    validateUser(email, password);
  } catch (error) {
    return NextResponse.json({ message: error as string }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  return NextResponse.json(
    { message: "User registered successfully" },
    { status: 201 }
  );
};

export const loginUser = async (req: NextRequest) => {
  const { email, password } = await req.json();
  await connectToDB();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = generateToken({
    payload: { id: user._id, role: user.role },
    expiresIn: 60 * 60,
  });

  const response = NextResponse.json(
    { message: "Login successful" },
    { status: 200 }
  );

  response.cookies.set("authToken", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
};
