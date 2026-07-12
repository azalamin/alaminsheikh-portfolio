import Link from "next/link";
import Image from "next/image";
import { listFeaturedProjects } from "@/services/content-service";
import { CoverPlaceholder } from "@/components/public/cover-placeholder";
import { FadeIn } from "@/components/public/fade-in";

export async function SelectedWorkSection() {
  const projects = await listFeaturedProjects();

  if (projects.length === 0) return null;

  return (
    <section id="work" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-20">
      <FadeIn>
        <h2 className="font-heading text-3xl">Selected work</h2>
        <p className="mt-2 text-muted-foreground">
          A few products I&apos;ve designed, built, and shipped.
        </p>
      </FadeIn>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {projects.map((project, index) => (
          <FadeIn key={project.id} delay={index * 0.05}>
            <Link href={`/work/${project.slug}`} className="group block">
              {project.coverImage ? (
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              ) : (
                <CoverPlaceholder title={project.title} className="aspect-video" />
              )}
              <h3 className="mt-4 text-lg font-medium group-hover:text-primary">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{project.summary}</p>
              {project.techStack.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {project.techStack.join(" · ")}
                </p>
              )}
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
