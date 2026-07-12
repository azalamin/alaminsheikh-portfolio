import { notFound } from "next/navigation";
import {
  getVideoProjectById,
  listEditors,
} from "@/services/video-project-service";
import { updateVideoProjectAction, togglePaymentStatusAction } from "@/actions/video-projects";
import { VideoProjectForm } from "@/components/video-project-form";
import { VideoStatusBadge, PaymentStatusBadge } from "@/components/status-badges";
import { formatCurrency } from "@/lib/currency";
import { ActionButton } from "@/components/dashboard/action-button";
import { LinkifiedText } from "@/components/linkified-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function AdminVideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, editors] = await Promise.all([
    getVideoProjectById(id),
    listEditors(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl">{project.title}</h1>
          <VideoStatusBadge status={project.status} />
          <PaymentStatusBadge status={project.paymentStatus} />
        </div>
        <ActionButton
          action={togglePaymentStatusAction.bind(null, project.id, project.paymentStatus)}
          successMessage={
            project.paymentStatus === "PAID" ? "Marked as unpaid." : "Marked as paid."
          }
          variant="outline"
        >
          Mark as {project.paymentStatus === "PAID" ? "unpaid" : "paid"}
        </ActionButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p className="tabular-nums">{project.progress}% complete</p>
          <p>Editor: {project.editor?.name ?? "Unassigned"}</p>
          <p className="tabular-nums">Amount: {formatCurrency(project.amount.toString())}</p>
          <p>Deadline: {project.deadline.toLocaleDateString()}</p>
          <p>
            Estimated completion:{" "}
            {project.estCompletion ? project.estCompletion.toLocaleDateString() : "—"}
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg mb-4">Edit project</h2>
        <VideoProjectForm
          action={updateVideoProjectAction.bind(null, project.id)}
          editors={editors}
          submitLabel="Save changes"
          successMessage="Video project updated."
          defaultValues={{
            title: project.title,
            description: project.description,
            amount: project.amount.toString(),
            deadline: project.deadline.toISOString().slice(0, 10),
            editorId: project.editorId,
          }}
        />
      </div>

      <Separator />

      <div>
        <h2 className="text-lg mb-4">Progress timeline</h2>
        {project.progressUpdates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No updates yet.</p>
        ) : (
          <ol className="flex flex-col gap-4">
            {project.progressUpdates.map((update) => (
              <li key={update.id} className="border-l-2 pl-4">
                <p className="text-sm text-muted-foreground">
                  {update.createdAt.toLocaleString()} · {update.author.name} ·{" "}
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
