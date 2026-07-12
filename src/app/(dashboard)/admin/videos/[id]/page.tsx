import { notFound } from "next/navigation";
import {
  getVideoProjectById,
  listEditors,
} from "@/services/video-project-service";
import { updateVideoProjectAction, togglePaymentStatusAction } from "@/actions/video-projects";
import { VideoProjectForm } from "@/components/video-project-form";
import { VideoStatusBadge, PaymentStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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

  const toggleAction = togglePaymentStatusAction.bind(
    null,
    project.id,
    project.paymentStatus
  );

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <VideoStatusBadge status={project.status} />
          <PaymentStatusBadge status={project.paymentStatus} />
        </div>
        <form action={toggleAction}>
          <Button type="submit" variant="outline">
            Mark as {project.paymentStatus === "PAID" ? "unpaid" : "paid"}
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p>{project.progress}% complete</p>
          <p>Editor: {project.editor?.name ?? "Unassigned"}</p>
          <p>Amount: {currency.format(Number(project.amount))}</p>
          <p>Deadline: {project.deadline.toLocaleDateString()}</p>
          <p>
            Estimated completion:{" "}
            {project.estCompletion ? project.estCompletion.toLocaleDateString() : "—"}
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-medium mb-4">Edit project</h2>
        <VideoProjectForm
          action={updateVideoProjectAction.bind(null, project.id)}
          editors={editors}
          submitLabel="Save changes"
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
        <h2 className="text-lg font-medium mb-4">Progress timeline</h2>
        {project.progressUpdates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No updates yet.</p>
        ) : (
          <ol className="flex flex-col gap-4">
            {project.progressUpdates.map((update) => (
              <li key={update.id} className="border-l-2 pl-4">
                <p className="text-sm text-muted-foreground">
                  {update.createdAt.toLocaleString()} · {update.author.name} · {update.progress}%
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
