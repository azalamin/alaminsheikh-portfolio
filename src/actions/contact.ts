"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/guards";
import { markContactSubmissionRead } from "@/services/contact-service";

export async function markContactReadAction(id: string) {
  await requireAdmin();
  await markContactSubmissionRead(id);
  revalidatePath("/admin/messages");
}
