import { notFound } from "next/navigation";
import { getProjectById } from "@/services/content-service";
import { updateProjectAction } from "@/actions/content";
import { ProjectForm } from "@/components/content/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit project</h1>
      <ProjectForm
        action={updateProjectAction.bind(null, project.id)}
        submitLabel="Save changes"
        defaultValues={project}
      />
    </div>
  );
}
