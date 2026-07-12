import { notFound } from "next/navigation";
import { getSession } from "@/lib/guards";
import { getVideoProjectById } from "@/services/video-project-service";
import { formatCurrency } from "@/lib/currency";
import { ProgressUpdateForm } from "@/components/progress-update-form";
import { VideoStatusBadge, PaymentStatusBadge } from "@/components/status-badges";
import { LinkifiedText } from "@/components/linkified-text";
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
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl">{project.title}</h1>
        <VideoStatusBadge status={project.status} />
        <PaymentStatusBadge status={project.paymentStatus} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brief</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p>{project.description}</p>
          <p className="pt-2 tabular-nums">
            Agreed amount: {formatCurrency(project.amount.toString())}
          </p>
          <p>Deadline: {project.deadline.toLocaleDateString()}</p>
          <p className="tabular-nums">{project.progress}% complete</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg mb-4">Post an update</h2>
        <ProgressUpdateForm
          videoProjectId={project.id}
          currentStatus={project.status}
          currentProgress={project.progress}
          currentEstCompletion={project.estCompletion}
        />
      </div>

      <Separator />

      <div>
        <h2 className="text-lg mb-4">History</h2>
        {project.progressUpdates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No updates yet.</p>
        ) : (
          <ol className="flex flex-col gap-4">
            {project.progressUpdates.map((update) => (
              <li key={update.id} className="border-l-2 pl-4">
                <p className="text-sm text-muted-foreground">
                  {update.createdAt.toLocaleString()} ·{" "}
                  <span className="tabular-nums">{update.progress}%</span>
                </p>
                <p>
                  <LinkifiedText text={update.note} />
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
