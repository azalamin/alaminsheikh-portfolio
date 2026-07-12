import { ContactForm } from "@/components/public/contact-form";
import { FadeIn } from "@/components/public/fade-in";

export function ContactSection() {
  return (
    <section id="contact" className="border-t bg-muted/30">
      <div className="mx-auto max-w-2xl scroll-mt-16 px-6 py-20">
        <FadeIn>
          <h2 className="font-heading text-3xl">Start a project</h2>
          <p className="mt-2 text-muted-foreground">
            Tell me a bit about what you&apos;re building — I&apos;ll get back to you within
            a couple of days.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
