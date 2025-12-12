import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters"),
  username: z
    .string()
    .trim()
    .max(50, "Username must be less than 50 characters")
    .optional()
    .or(z.literal("")),
});

export const loginSchema = authSchema.pick({ email: true, password: true });
export const signupSchema = authSchema;

export type AuthFormData = z.infer<typeof authSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

export type ValidationResult = 
  | { success: true; data: { email: string; password: string; username?: string } }
  | { success: false; error: string };

export function validateAuth(
  data: { email: string; password: string; username?: string },
  isLogin: boolean
): ValidationResult {
  if (isLogin) {
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const firstError = result.error.errors[0];
      return { success: false, error: firstError.message };
    }
    return { 
      success: true, 
      data: { 
        email: result.data.email, 
        password: result.data.password
      } 
    };
  } else {
    const result = signupSchema.safeParse(data);
    if (!result.success) {
      const firstError = result.error.errors[0];
      return { success: false, error: firstError.message };
    }
    return { 
      success: true, 
      data: { 
        email: result.data.email, 
        password: result.data.password,
        username: result.data.username || undefined
      } 
    };
  }
}
