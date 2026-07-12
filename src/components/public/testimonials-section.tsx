import { Star } from "lucide-react";
import { listPublishedTestimonials } from "@/services/content-service";
import { FadeIn } from "@/components/public/fade-in";
import { cn } from "@/lib/utils";

export async function TestimonialsSection() {
  const testimonials = await listPublishedTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-20">
      <FadeIn>
        <h2 className="font-heading text-3xl">What clients say</h2>
      </FadeIn>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {testimonials.map((testimonial, index) => (
          <FadeIn key={testimonial.id} delay={index * 0.05}>
            <div className="flex flex-col gap-3 rounded-lg border p-6">
              <div className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < testimonial.rating
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground">&ldquo;{testimonial.content}&rdquo;</p>
              <p className="text-sm text-muted-foreground">
                {testimonial.clientName}
                {testimonial.clientRole ? ` · ${testimonial.clientRole}` : ""}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
