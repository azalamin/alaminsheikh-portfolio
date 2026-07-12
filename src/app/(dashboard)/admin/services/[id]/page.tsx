import { notFound } from "next/navigation";
import { getServiceById } from "@/services/content-service";
import { updateServiceAction } from "@/actions/content";
import { ServiceForm } from "@/components/content/service-form";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit service</h1>
      <ServiceForm
        action={updateServiceAction.bind(null, service.id)}
        submitLabel="Save changes"
        defaultValues={service}
      />
    </div>
  );
}
