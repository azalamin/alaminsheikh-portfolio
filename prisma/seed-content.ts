/**
 * Seeds draft launch content (flagship case studies + service listing) as
 * DRAFTS (published: false). This is placeholder copy — review and rewrite
 * the real specifics via /admin before publishing. Safe to re-run: skips
 * any record whose slug/title already exists.
 */
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const projects = [
  {
    title: "Real Estate Digital Management System",
    slug: "real-estate-digital-management-system",
    summary:
      "A digital system for managing property listings, clients, and internal operations — replacing fragmented manual processes.",
    content: `## Problem

[DRAFT — describe the specific operational pain point: how property listings,
client records, and internal workflows were being handled before this system,
and why that broke down as the business grew.]

## Solution

Designed and built a digital management system covering [property listings /
client records / internal workflows — confirm exact scope]. Built with a
Next.js/TypeScript frontend, a PostgreSQL database via Prisma, and role-based
access so different teams see only what's relevant to them.

## My role

[DRAFT — describe your specific role: sole engineer, part of a team, what you
owned end-to-end vs. contributed to.]

## Result

[DRAFT — outcome in general terms, e.g. time saved, reduction in manual
errors, adoption across teams. No internal business figures without sign-off.]

> **Note:** this case study covers production work at Unique Land Developer
> Pvt. Ltd. Keep specifics high-level and get employer sign-off before
> publishing.`,
    coverImage: null,
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    liveUrl: null,
    featured: true,
    published: false,
    order: 1,
  },
  {
    title: "FoodHub",
    slug: "foodhub",
    summary:
      "A full-stack food marketplace with role-based access control and a dual-architecture backend.",
    content: `## Problem

[DRAFT — what gap FoodHub filled: connecting restaurants/vendors with
customers, or whatever the specific marketplace problem was.]

## Solution

Built a full-stack marketplace with role-based access control (RBAC) for
distinct user types (e.g. customers, vendors, admins), authenticated with
Better Auth, and backed by PostgreSQL via Prisma. The system used a
dual-architecture approach [DRAFT — explain what "dual-architecture" meant
here: separate services, separate apps, or a specific split you want to
highlight].

## My role

[DRAFT — describe scope: solo project, team project, what you built.]

## Result

[DRAFT — real users, transaction volume, or whatever outcome is worth
naming.]`,
    coverImage: null,
    techStack: ["Next.js", "Better Auth", "Prisma", "PostgreSQL"],
    liveUrl: null,
    featured: true,
    published: false,
    order: 2,
  },
  {
    title: "Find English",
    slug: "find-english",
    summary:
      "An English learning platform I founded, built, and grew from scratch — findenglishbd.com.",
    content: `## Problem

[DRAFT — the gap in English-learning options that prompted starting this,
and for whom.]

## Solution

Founded, built, and grew Find English (findenglishbd.com) as a platform for
learning English online. [DRAFT — describe the product: course structure,
live classes, self-paced content, whatever the platform actually offers.]

## My role

Founder — owned the product end-to-end: engineering, and growing the user
base. [DRAFT — add detail on the technical stack and any team involved.]

## Result

[DRAFT — real user numbers, growth story, retention — whatever you're
comfortable sharing publicly.]`,
    coverImage: null,
    techStack: [],
    liveUrl: "https://findenglishbd.com",
    featured: true,
    published: false,
    order: 3,
  },
];

const services = [
  {
    title: "Full-stack web application development",
    description:
      "[DRAFT] End-to-end product engineering — data modeling, backend logic, and the interface people actually use. From a blank repo to a deployed, working product.",
    published: false,
    order: 1,
  },
  {
    title: "System architecture & technical consulting",
    description:
      "[DRAFT] Advice and hands-on help designing systems that hold up under real usage — database design, auth, access control, and deployment.",
    published: false,
    order: 2,
  },
  {
    title: "MVP development for founders",
    description:
      "[DRAFT] Taking a product idea from zero to a real, usable first version — fast, without cutting corners that make it unusable at scale.",
    published: false,
    order: 3,
  },
];

async function main() {
  for (const project of projects) {
    const existing = await prisma.project.findUnique({ where: { slug: project.slug } });
    if (existing) {
      console.log(`Skipped project (already exists): ${project.title}`);
      continue;
    }
    await prisma.project.create({ data: project });
    console.log(`Created draft project: ${project.title}`);
  }

  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { title: service.title } });
    if (existing) {
      console.log(`Skipped service (already exists): ${service.title}`);
      continue;
    }
    await prisma.service.create({ data: service });
    console.log(`Created draft service: ${service.title}`);
  }

  console.log("\nAll seeded content is published: false — review and rewrite via /admin.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
