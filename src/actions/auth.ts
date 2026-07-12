"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isAPIError } from "better-auth/api";
import { auth } from "@/lib/auth";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginState = { error: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  let role: string | null | undefined;
  try {
    const result = await auth.api.signInEmail({ body: parsed.data });
    role = result.user.role;
  } catch (error) {
    if (isAPIError(error)) {
      // Never reveal whether the email or the password was wrong.
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  redirect(role === "admin" ? "/admin" : "/editor");
}

export async function logout() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}
