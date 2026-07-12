import { prisma } from "@/lib/prisma";

export function listContactSubmissions() {
  return prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
}

export function markContactSubmissionRead(id: string) {
  return prisma.contactSubmission.update({ where: { id }, data: { read: true } });
}
