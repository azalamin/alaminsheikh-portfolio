import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-24 sm:py-32">
      <p className="text-sm text-muted-foreground">Software Engineer</p>
      <h1 className="max-w-3xl font-heading text-4xl leading-tight sm:text-5xl">
        I build software that real businesses run on.
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        I design and ship full-stack products end to end — from data model to
        production — for organizations that need software to actually work.
      </p>
      <div>
        <Button size="lg" render={<Link href="/#contact" />} nativeButton={false}>
          Start a project
        </Button>
      </div>
    </section>
  );
}
