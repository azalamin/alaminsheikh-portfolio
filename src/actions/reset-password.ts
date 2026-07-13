"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { isAPIError } from "better-auth/api";
import { auth } from "@/lib/auth";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "This reset link is invalid or has expired."),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type ResetPasswordState = { error: string } | undefined;

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  try {
    await auth.api.resetPassword({
      body: { newPassword: parsed.data.newPassword, token: parsed.data.token },
    });
  } catch (error) {
    if (isAPIError(error)) {
      return { error: "This reset link is invalid or has expired." };
    }
    throw error;
  }

  redirect("/login");
}
