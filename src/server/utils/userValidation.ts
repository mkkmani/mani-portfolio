import { z } from "zod";

const userSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const validateUser = (email: string, password: string) => {
  const validationResult = userSchema.safeParse({ email, password });
  if (!validationResult.success) {
    throw new Error(validationResult.error.message);
  }
};
