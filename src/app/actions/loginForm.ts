"use server";

import { loginSchema } from "@/lib/validators/auth";
import { LoginFormState } from "@/types/auth.type";
import { signIn } from "@/server/services/auth/authService";
import { createAppError, isAppError } from "@/server/security/appError";


export async function loginUser(
  _: unknown,
  formData: FormData
): Promise<LoginFormState> {
  try {
    const raw = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    const result = loginSchema.safeParse(raw);
    if (!result.success) {
      const errors: LoginFormState["errors"] = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof errors;
        errors[field] = field === "email" ? "LOGIN_EMAIL_INVALID" : "LOGIN_PASSWORD_REQUIRED";
      });
      return { errors, values: { email: raw.email } };
    }

    const { email, password } = result.data;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!res || res.error) {
      throw createAppError(
        "SIGNIN_FAILED",
        "Something went wrong. Please try again."
      );
    }
    return { success: true };
  } catch (err) {
    if (isAppError(err)) {
      return {
        errors: { general: err.code === "RATE_LIMITED" ? "LOGIN_RATE_LIMITED" : "LOGIN_FAILED" },
        values: { email: "" },
      };
    }
    if (err instanceof Error && err.message === "Too many requests") {
      return {
        errors: { general: "LOGIN_RATE_LIMITED" },
        values: { email: "" },
      };
    }
    return {
      errors: { general: "LOGIN_FAILED" },
      values: { email: "" },
    }
  }
}
