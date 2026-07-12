import { listPublishedServices } from "@/services/content-service";
import { FadeIn } from "@/components/public/fade-in";

export async function ServicesSection() {
  const services = await listPublishedServices();

  if (services.length === 0) return null;

  return (
    <section id="services" className="border-t bg-muted/30">
      <div className="mx-auto max-w-5xl scroll-mt-16 px-6 py-20">
        <FadeIn>
          <h2 className="font-heading text-3xl">Services</h2>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {services.map((service, index) => (
            <FadeIn key={service.id} delay={index * 0.05}>
              <h3 className="text-lg font-medium">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
