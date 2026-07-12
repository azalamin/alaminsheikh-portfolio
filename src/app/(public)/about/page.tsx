import type { Metadata } from "next";
import { FadeIn } from "@/components/public/fade-in";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About",
  description:
    "Software engineer building full-stack products for real organizations.",
};

// Hardcoded for v1 — no Skill model. Group labels match the PRD spec exactly.
const skills = [
  {
    group: "Frontend",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Better Auth", "Zod", "REST APIs"],
  },
  {
    group: "Database",
    items: ["PostgreSQL", "Prisma ORM"],
  },
  {
    group: "Tools",
    items: ["Git", "Vercel", "Docker"],
  },
];

const timeline = [
  {
    role: "Software Engineer",
    place: "Unique Land Developer Pvt. Ltd.",
    period: "Present",
  },
  {
    // TODO: replace with real internship company/dates.
    role: "Software Engineering Intern",
    place: "[Internship company]",
    period: "[Dates]",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <FadeIn>
        <h1 className="font-heading text-4xl">About</h1>
        <div className="mt-6 flex flex-col gap-4 text-muted-foreground">
          <p>
            I&apos;m a software engineer who ships real products for real
            organizations — not demos, not tutorials. I work across the full
            stack: data modeling, backend logic, and the interface people
            actually use.
          </p>
          <p>
            Currently I&apos;m a Software Engineer at{" "}
            <span className="text-foreground">Unique Land Developer Pvt. Ltd.</span>,
            building the systems the business runs on day to day.
          </p>
        </div>
      </FadeIn>

      <Separator className="my-10" />

      <FadeIn>
        <h2 className="font-heading text-2xl">Experience</h2>
        <ol className="mt-6 flex flex-col gap-4">
          {timeline.map((entry) => (
            <li key={entry.role + entry.place} className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-foreground">{entry.role}</p>
                <p className="text-sm text-muted-foreground">{entry.place}</p>
              </div>
              <p className="shrink-0 text-sm text-muted-foreground">{entry.period}</p>
            </li>
          ))}
        </ol>
      </FadeIn>

      <Separator className="my-10" />

      <FadeIn>
        <h2 className="font-heading text-2xl">Skills</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {skills.map((group) => (
            <div key={group.group}>
              <p className="text-sm font-medium text-foreground">{group.group}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {group.items.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>

      <Separator className="my-10" />

      <FadeIn>
        <p className="text-sm text-muted-foreground">
          Beyond the code, I write and produce documentary-style content on
          geopolitics and history.
        </p>
      </FadeIn>
    </div>
  );
}
