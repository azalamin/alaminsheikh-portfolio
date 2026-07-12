import { prisma } from "@/lib/prisma";

export function createContactSubmission(data: {
  name: string;
  email: string;
  message: string;
}) {
  return prisma.contactSubmission.create({ data });
}

export function listContactSubmissions() {
  return prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
}

export function markContactSubmissionRead(id: string) {
  return prisma.contactSubmission.update({ where: { id }, data: { read: true } });
}
