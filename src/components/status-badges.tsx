import { Badge } from "@/components/ui/badge";
import type { VideoStatus, PaymentStatus } from "@/generated/prisma/enums";

const statusLabels: Record<VideoStatus, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  IN_REVIEW: "In review",
  COMPLETED: "Completed",
};

export function VideoStatusBadge({ status }: { status: VideoStatus }) {
  const variant = status === "COMPLETED" ? "default" : "secondary";
  return <Badge variant={variant}>{statusLabels[status]}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant={status === "PAID" ? "success" : "warning"}>
      {status === "PAID" ? "Paid" : "Unpaid"}
    </Badge>
  );
}
