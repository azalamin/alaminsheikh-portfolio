import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { listAllVideoProjects } from "@/services/video-project-service";
import { formatCurrency } from "@/lib/currency";
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
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function AdminVideosPage() {
  const projects = await listAllVideoProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Video projects</h1>
        <Button render={<Link href="/admin/videos/new" />}>New project</Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={Clapperboard}
          title="No video projects yet"
          description="Create a project and assign it to an editor to start tracking progress."
          action={
            <Button render={<Link href="/admin/videos/new" />} variant="outline" size="sm">
              New project
            </Button>
          }
        />
      ) : (
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
                  <TableCell className="text-muted-foreground">
                    {project.editor?.name ?? "Unassigned"}
                  </TableCell>
                  <TableCell>
                    <VideoStatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={project.paymentStatus} />
                  </TableCell>
                  <TableCell>{formatCurrency(project.amount.toString())}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.deadline.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
