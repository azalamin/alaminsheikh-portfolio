import Link from "next/link";
import { getSession } from "@/lib/guards";
import {
  listVideoProjectsForEditor,
  splitActiveAndArchived,
} from "@/services/video-project-service";
import { VideoStatusBadge } from "@/components/status-badges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ProjectList({
  projects,
  emptyLabel,
}: {
  projects: Awaited<ReturnType<typeof listVideoProjectsForEditor>>;
  emptyLabel: string;
}) {
  if (projects.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {projects.map((project) => (
        <Link key={project.id} href={`/editor/videos/${project.id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{project.title}</CardTitle>
                <VideoStatusBadge status={project.status} />
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {project.progress}% complete · Deadline {project.deadline.toLocaleDateString()}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default async function EditorHomePage() {
  const session = await getSession();
  const projects = await listVideoProjectsForEditor(session!.user.id);
  const { active, archived } = splitActiveAndArchived(projects);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">My videos</h1>
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archived.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <ProjectList projects={active} emptyLabel="No active projects assigned to you." />
        </TabsContent>
        <TabsContent value="archived" className="mt-4">
          <ProjectList projects={archived} emptyLabel="No archived projects yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
