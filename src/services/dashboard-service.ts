import { prisma } from "@/lib/prisma";

export async function getAdminOverviewStats() {
  const [activeVideos, unpaidAgg, unreadMessages] = await Promise.all([
    prisma.videoProject.count({
      where: {
        NOT: { status: "COMPLETED", paymentStatus: "PAID" },
      },
    }),
    prisma.videoProject.aggregate({
      where: { paymentStatus: "UNPAID" },
      _sum: { amount: true },
    }),
    prisma.contactSubmission.count({ where: { read: false } }),
  ]);

  return {
    activeVideos,
    unpaidAmount: (unpaidAgg._sum.amount ?? 0).toString(),
    unreadMessages,
  };
}
