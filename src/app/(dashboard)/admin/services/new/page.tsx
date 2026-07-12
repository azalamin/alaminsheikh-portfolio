import { createServiceAction } from "@/actions/content";
import { ServiceForm } from "@/components/content/service-form";

export default function NewServicePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl">New service</h1>
      <ServiceForm action={createServiceAction} submitLabel="Create service" />
    </div>
  );
}
