import { createVideoProjectAction } from "@/actions/video-projects";
import { listEditors } from "@/services/video-project-service";
import { VideoProjectForm } from "@/components/video-project-form";

export default async function NewVideoProjectPage() {
  const editors = await listEditors();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New video project</h1>
      <VideoProjectForm
        action={createVideoProjectAction}
        editors={editors}
        submitLabel="Create project"
      />
    </div>
  );
}
