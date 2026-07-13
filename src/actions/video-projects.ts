"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/guards";
import { videoProjectSchema } from "@/lib/validations/video-project";
import {
  createVideoProject,
  getEditorById,
  setPaymentStatus,
  updateVideoProjectDetails,
} from "@/services/video-project-service";
import { sendVideoAssignedEmail } from "@/services/mail";
import { prisma } from "@/lib/prisma";
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

async function notifyEditorOfAssignment(
  editorId: string,
  project: { title: string; description: string; amount: unknown; deadline: Date }
) {
  try {
    const editor = await getEditorById(editorId);
    if (!editor) return;

    await sendVideoAssignedEmail({
      to: editor.email,
      editorName: editor.name,
      projectTitle: project.title,
      description: project.description,
      amount: String(project.amount),
      deadline: project.deadline,
    });
  } catch {
    // The assignment is already saved; a failed notification shouldn't fail the request.
  }
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

  if (project.editorId) {
    await notifyEditorOfAssignment(project.editorId, project);
  }

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

  const before = await prisma.videoProject.findUnique({
    where: { id },
    select: { editorId: true },
  });

  const project = await updateVideoProjectDetails(id, parsed.data);

  const editorChanged = project.editorId && project.editorId !== before?.editorId;
  if (editorChanged && project.editorId) {
    await notifyEditorOfAssignment(project.editorId, project);
  }

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
