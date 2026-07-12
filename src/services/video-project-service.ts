import { prisma } from "@/lib/prisma";
import type { VideoStatus, PaymentStatus } from "@/generated/prisma/enums";

const editorSummarySelect = {
  id: true,
  name: true,
  email: true,
} as const;

const progressUpdateSelect = {
  id: true,
  note: true,
  progress: true,
  createdAt: true,
  author: { select: editorSummarySelect },
} as const;

export function listEditors() {
  return prisma.user.findMany({
    where: { role: "editor", banned: { not: true } },
    select: editorSummarySelect,
    orderBy: { name: "asc" },
  });
}

export function listAllVideoProjects() {
  return prisma.videoProject.findMany({
    include: { editor: { select: editorSummarySelect } },
    orderBy: { createdAt: "desc" },
  });
}

export function listVideoProjectsForEditor(editorId: string) {
  return prisma.videoProject.findMany({
    where: { editorId },
    orderBy: { deadline: "asc" },
  });
}

export function splitActiveAndArchived<
  T extends { status: VideoStatus; paymentStatus: PaymentStatus },
>(projects: T[]) {
  const active: T[] = [];
  const archived: T[] = [];
  for (const project of projects) {
    if (project.status === "COMPLETED" && project.paymentStatus === "PAID") {
      archived.push(project);
    } else {
      active.push(project);
    }
  }
  return { active, archived };
}

export function getVideoProjectById(id: string) {
  return prisma.videoProject.findUnique({
    where: { id },
    include: {
      editor: { select: editorSummarySelect },
      progressUpdates: {
        select: progressUpdateSelect,
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export function createVideoProject(data: {
  title: string;
  description: string;
  amount: number;
  deadline: Date;
  editorId?: string;
}) {
  return prisma.videoProject.create({ data });
}

export function updateVideoProjectDetails(
  id: string,
  data: {
    title: string;
    description: string;
    amount: number;
    deadline: Date;
    editorId?: string;
  }
) {
  return prisma.videoProject.update({
    where: { id },
    data: { ...data, editorId: data.editorId ?? null },
  });
}

export function setPaymentStatus(id: string, paymentStatus: PaymentStatus) {
  return prisma.videoProject.update({
    where: { id },
    data: { paymentStatus },
  });
}

export function addProgressUpdate(
  videoProjectId: string,
  authorId: string,
  data: {
    status: VideoStatus;
    progress: number;
    estCompletion: Date | null;
    note: string;
  }
) {
  return prisma.$transaction([
    prisma.videoProject.update({
      where: { id: videoProjectId },
      data: {
        status: data.status,
        progress: data.progress,
        estCompletion: data.estCompletion,
      },
    }),
    prisma.progressUpdate.create({
      data: {
        videoProjectId,
        authorId,
        note: data.note,
        progress: data.progress,
      },
    }),
  ]);
}
