"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/guards";
import { videoProjectSchema } from "@/lib/validations/video-project";
import {
  createVideoProject,
  setPaymentStatus,
  updateVideoProjectDetails,
} from "@/services/video-project-service";
import type { PaymentStatus } from "@/generated/prisma/enums";

export type VideoProjectFormState =
  | { error: string }
  | { success: true; id: string }
  | undefined;

function parseVideoProjectForm(formData: FormData) {
  return videoProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    deadline: formData.get("deadline"),
    editorId: formData.get("editorId"),
  });
}

export async function createVideoProjectAction(
  _prevState: VideoProjectFormState,
  formData: FormData
): Promise<VideoProjectFormState> {
  await requireAdmin();

  const parsed = parseVideoProjectForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const project = await createVideoProject(parsed.data);

  revalidatePath("/admin/videos");
  return { success: true, id: project.id };
}

export async function updateVideoProjectAction(
  id: string,
  _prevState: VideoProjectFormState,
  formData: FormData
): Promise<VideoProjectFormState> {
  await requireAdmin();

  const parsed = parseVideoProjectForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  await updateVideoProjectDetails(id, parsed.data);

  revalidatePath(`/admin/videos/${id}`);
  revalidatePath("/admin/videos");
  return { success: true, id };
}

export async function togglePaymentStatusAction(
  id: string,
  current: PaymentStatus
) {
  await requireAdmin();

  await setPaymentStatus(id, current === "PAID" ? "UNPAID" : "PAID");

  revalidatePath(`/admin/videos/${id}`);
  revalidatePath("/admin/videos");
}
