import Link from "next/link";
import { listAllVideoProjects } from "@/services/video-project-service";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VideoStatusBadge, PaymentStatusBadge } from "@/components/status-badges";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function AdminVideosPage() {
  const projects = await listAllVideoProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Video projects</h1>
        <Button render={<Link href="/admin/videos/new" />}>New project</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Editor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No video projects yet.
                </TableCell>
              </TableRow>
            )}
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link
                    href={`/admin/videos/${project.id}`}
                    className="font-medium hover:underline"
                  >
                    {project.title}
                  </Link>
                </TableCell>
                <TableCell>{project.editor?.name ?? "Unassigned"}</TableCell>
                <TableCell>
                  <VideoStatusBadge status={project.status} />
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={project.paymentStatus} />
                </TableCell>
                <TableCell>{currency.format(Number(project.amount))}</TableCell>
                <TableCell>{project.deadline.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
