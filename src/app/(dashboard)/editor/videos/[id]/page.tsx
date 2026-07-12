import { notFound } from "next/navigation";
import { getSession } from "@/lib/guards";
import { getVideoProjectById } from "@/services/video-project-service";
import { ProgressUpdateForm } from "@/components/progress-update-form";
import { VideoStatusBadge } from "@/components/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function EditorVideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, project] = await Promise.all([
    getSession(),
    getVideoProjectById(id),
  ]);

  if (!project) {
    notFound();
  }

  const isOwner = project.editorId === session?.user.id;
  const isAdmin = session?.user.role === "admin";
  if (!isOwner && !isAdmin) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <VideoStatusBadge status={project.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brief</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p>{project.description}</p>
          <p className="pt-2">Deadline: {project.deadline.toLocaleDateString()}</p>
          <p>{project.progress}% complete</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-medium mb-4">Post an update</h2>
        <ProgressUpdateForm
          videoProjectId={project.id}
          currentStatus={project.status}
          currentProgress={project.progress}
          currentEstCompletion={project.estCompletion}
        />
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-medium mb-4">History</h2>
        {project.progressUpdates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No updates yet.</p>
        ) : (
          <ol className="flex flex-col gap-4">
            {project.progressUpdates.map((update) => (
              <li key={update.id} className="border-l-2 pl-4">
                <p className="text-sm text-muted-foreground">
                  {update.createdAt.toLocaleString()} · {update.progress}%
                </p>
                <p>{update.note}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
