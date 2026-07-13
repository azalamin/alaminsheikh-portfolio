"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";

const forgotPasswordSchema = z.object({ email: z.email() });

export type ForgotPasswordState = { error: string } | { success: true } | undefined;

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { error: "Enter a valid email." };
  }

  await auth.api.requestPasswordReset({
    body: { email: parsed.data.email, redirectTo: "/reset-password" },
  });

  return { success: true };
}
