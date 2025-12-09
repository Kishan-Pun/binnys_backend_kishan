import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "Role must be user or admin" }),
  }),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Enter a valid email").optional(),
  role: z
    .enum(["user", "admin"], {
      errorMap: () => ({ message: "Role must be user or admin" }),
    })
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
});
