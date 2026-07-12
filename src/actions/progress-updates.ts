"use server";

import { revalidatePath } from "next/cache";
import { requireEditor, requireOwnership } from "@/lib/guards";
import { progressUpdateSchema } from "@/lib/validations/video-project";
import { addProgressUpdate } from "@/services/video-project-service";
import { prisma } from "@/lib/prisma";

export type ProgressUpdateFormState = { error: string } | undefined;

export async function postProgressUpdateAction(
  videoProjectId: string,
  _prevState: ProgressUpdateFormState,
  formData: FormData
): Promise<ProgressUpdateFormState> {
  const session = await requireEditor();

  const project = await prisma.videoProject.findUnique({
    where: { id: videoProjectId },
    select: { editorId: true },
  });

  if (!project) {
    return { error: "Project not found." };
  }

  requireOwnership(project.editorId, session.user.id);

  const parsed = progressUpdateSchema.safeParse({
    status: formData.get("status"),
    progress: formData.get("progress"),
    estCompletion: formData.get("estCompletion"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  await addProgressUpdate(videoProjectId, session.user.id, parsed.data);

  revalidatePath(`/editor/videos/${videoProjectId}`);
  revalidatePath("/editor");
}
