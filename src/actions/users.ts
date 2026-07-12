"use server";

import { revalidatePath } from "next/cache";
import { isAPIError } from "better-auth/api";
import { requireAdmin } from "@/lib/guards";
import { createEditorSchema } from "@/lib/validations/editor";
import { createEditorAccount, banEditor, unbanEditor } from "@/services/user-service";

export type CreateEditorFormState = { error: string } | { success: true } | undefined;

export async function createEditorAction(
  _prevState: CreateEditorFormState,
  formData: FormData
): Promise<CreateEditorFormState> {
  await requireAdmin();

  const parsed = createEditorSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  try {
    await createEditorAccount(parsed.data);
  } catch (error) {
    if (isAPIError(error)) {
      return { error: error.message ?? "Could not create that account." };
    }
    return { error: "Account was created, but the invite email could not be sent." };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function banEditorAction(userId: string, reason: string) {
  await requireAdmin();
  await banEditor(userId, reason || "Deactivated by admin");
  revalidatePath("/admin/users");
}

export async function unbanEditorAction(userId: string) {
  await requireAdmin();
  await unbanEditor(userId);
  revalidatePath("/admin/users");
}
