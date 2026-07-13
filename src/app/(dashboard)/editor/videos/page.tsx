import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { getSession } from "@/lib/guards";
import {
  listVideoProjectsForEditor,
  splitActiveAndArchived,
} from "@/services/video-project-service";
import { formatCurrency } from "@/lib/currency";
import { VideoStatusBadge, PaymentStatusBadge } from "@/components/status-badges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";

function ProjectList({
  projects,
  emptyTitle,
  emptyDescription,
}: {
  projects: Awaited<ReturnType<typeof listVideoProjectsForEditor>>;
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (projects.length === 0) {
    return (
      <EmptyState icon={Clapperboard} title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {projects.map((project) => (
        <Link key={project.id} href={`/editor/videos/${project.id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">{project.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <VideoStatusBadge status={project.status} />
                  <PaymentStatusBadge status={project.paymentStatus} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                <span className="tabular-nums">{project.progress}%</span> complete · Deadline{" "}
                {project.deadline.toLocaleDateString()}
              </span>
              <span className="tabular-nums">{formatCurrency(project.amount.toString())}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default async function EditorVideosPage() {
  const session = await getSession();
  const projects = await listVideoProjectsForEditor(session!.user.id);
  const { active, archived } = splitActiveAndArchived(projects);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl">My videos</h1>
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archived.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <ProjectList
            projects={active}
            emptyTitle="No active projects"
            emptyDescription="Projects assigned to you will show up here."
          />
        </TabsContent>
        <TabsContent value="archived" className="mt-4">
          <ProjectList
            projects={archived}
            emptyTitle="No archived projects yet"
            emptyDescription="Completed and paid projects move here automatically."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
