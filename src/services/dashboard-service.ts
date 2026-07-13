import { prisma } from "@/lib/prisma";

export async function getAdminOverviewStats() {
  const [
    pendingVideos,
    unpaidAgg,
    paidAgg,
    unreadMessages,
    assignedVideos,
    unassignedVideos,
    completedVideos,
    activeEditors,
  ] = await Promise.all([
    prisma.videoProject.count({
      where: { NOT: { status: "COMPLETED" } },
    }),
    prisma.videoProject.aggregate({
      where: { paymentStatus: "UNPAID" },
      _sum: { amount: true },
    }),
    prisma.videoProject.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { amount: true },
    }),
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.videoProject.count({ where: { editorId: { not: null } } }),
    prisma.videoProject.count({ where: { editorId: null } }),
    prisma.videoProject.count({ where: { status: "COMPLETED" } }),
    prisma.user.count({ where: { role: "editor", banned: { not: true } } }),
  ]);

  return {
    pendingVideos,
    unpaidAmount: (unpaidAgg._sum.amount ?? 0).toString(),
    totalSpent: (paidAgg._sum.amount ?? 0).toString(),
    unreadMessages,
    assignedVideos,
    unassignedVideos,
    completedVideos,
    activeEditors,
  };
}

export async function getEditorOverviewStats(editorId: string) {
  const [totalVideos, pendingVideos, paidAgg, unpaidAgg] = await Promise.all([
    prisma.videoProject.count({ where: { editorId } }),
    prisma.videoProject.count({
      where: { editorId, NOT: { status: "COMPLETED" } },
    }),
    prisma.videoProject.aggregate({
      where: { editorId, paymentStatus: "PAID" },
      _sum: { amount: true },
    }),
    prisma.videoProject.aggregate({
      where: { editorId, paymentStatus: "UNPAID" },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalVideos,
    pendingVideos,
    totalEarnings: (paidAgg._sum.amount ?? 0).toString(),
    pendingPayout: (unpaidAgg._sum.amount ?? 0).toString(),
  };
}
