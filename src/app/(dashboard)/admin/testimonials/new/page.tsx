import { createTestimonialAction } from "@/actions/content";
import { TestimonialForm } from "@/components/content/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl">New testimonial</h1>
      <TestimonialForm action={createTestimonialAction} submitLabel="Create testimonial" />
    </div>
  );
}
