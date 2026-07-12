import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendEditorInviteEmail } from "@/services/mail";

export function listEditorAccounts() {
  return prisma.user.findMany({
    where: { role: "editor" },
    select: {
      id: true,
      name: true,
      email: true,
      banned: true,
      banReason: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

function generateTempPassword() {
  return randomBytes(12).toString("base64url");
}

export async function createEditorAccount(params: { name: string; email: string }) {
  const tempPassword = generateTempPassword();

  const result = await auth.api.createUser({
    body: {
      email: params.email,
      password: tempPassword,
      name: params.name,
      role: "editor",
      data: { mustChangePassword: true },
    },
  });

  await sendEditorInviteEmail({
    to: params.email,
    name: params.name,
    tempPassword,
  });

  return result.user;
}

export async function banEditor(userId: string, reason: string) {
  return auth.api.banUser({
    headers: await headers(),
    body: { userId, banReason: reason },
  });
}

export async function unbanEditor(userId: string) {
  return auth.api.unbanUser({
    headers: await headers(),
    body: { userId },
  });
}
