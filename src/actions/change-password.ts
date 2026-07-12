"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAPIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type ChangePasswordState = { error: string } | undefined;

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await requireUser();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      },
    });
  } catch (error) {
    if (isAPIError(error)) {
      return { error: "Your current password is incorrect." };
    }
    throw error;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { mustChangePassword: false },
  });

  redirect(session.user.role === "admin" ? "/admin" : "/editor");
}
