"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/guards";
import { contactSchema } from "@/lib/validations/contact";
import { createContactSubmission, markContactSubmissionRead } from "@/services/contact-service";
import { sendContactNotificationEmail } from "@/services/mail";

export async function markContactReadAction(id: string) {
  await requireAdmin();
  await markContactSubmissionRead(id);
  revalidatePath("/admin/messages");
}

export type ContactFormState = { error: string } | { success: true } | undefined;

/** Public — no guard by design; this is the site's contact form. */
export async function submitContactFormAction(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  await createContactSubmission(parsed.data);

  try {
    await sendContactNotificationEmail(parsed.data);
  } catch {
    // The submission is already saved; a failed notification email shouldn't
    // block the visitor from seeing a success state.
  }

  revalidatePath("/admin/messages");
  return { success: true };
}
