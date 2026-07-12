import { notFound } from "next/navigation";
import { getTestimonialById } from "@/services/content-service";
import { updateTestimonialAction } from "@/actions/content";
import { TestimonialForm } from "@/components/content/testimonial-form";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl">Edit testimonial</h1>
      <TestimonialForm
        action={updateTestimonialAction.bind(null, testimonial.id)}
        submitLabel="Save changes"
        defaultValues={testimonial}
      />
    </div>
  );
}
