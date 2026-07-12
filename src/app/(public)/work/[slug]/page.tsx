import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowUpRight } from "lucide-react";
import {
  getPublishedProjectBySlug,
  listPublishedProjects,
} from "@/services/content-service";
import { CoverPlaceholder } from "@/components/public/cover-placeholder";
import { FadeIn } from "@/components/public/fade-in";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await listPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-2xl px-6 py-20">
      <FadeIn>
        <h1 className="font-heading text-4xl">{project.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{project.summary}</p>

        {project.techStack.length > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            {project.techStack.join(" · ")}
          </p>
        )}

        {project.liveUrl && (
          <Button
            variant="outline"
            className="mt-6"
            render={<Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
          >
            View live
            <ArrowUpRight />
          </Button>
        )}
      </FadeIn>

      <FadeIn delay={0.1}>
        {project.coverImage ? (
          <div className="relative mt-10 aspect-video overflow-hidden rounded-lg border">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(min-width: 672px) 672px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <CoverPlaceholder title={project.title} className="mt-10 aspect-video" />
        )}
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="prose prose-neutral dark:prose-invert prose-headings:font-heading mt-10 max-w-none">
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </div>
      </FadeIn>
    </article>
  );
}
