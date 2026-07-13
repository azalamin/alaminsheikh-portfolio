# Al Amin Sheikh — Portfolio & Project Dashboard

A single Next.js application serving three surfaces: a premium public portfolio, an admin dashboard for content and video-project management, and a restricted editor dashboard for tracking assigned video work end-to-end (assignment → progress → completion → payment).

**Live:** [alaminsheikh.vercel.app](https://alaminsheikh.vercel.app)

---

## Contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Data model](#data-model)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Authentication & roles](#authentication--roles)
- [Email](#email)
- [Deployment](#deployment)
- [Security notes](#security-notes)

---

## Overview

| Surface | Who | What |
|---|---|---|
| **Public portfolio** | Visitors | Hero, selected work (case studies), services, testimonials, about, contact form. Statically rendered where possible, minimalist premium design. |
| **Admin dashboard** (`/admin`) | Site owner | Full content CRUD (projects, testimonials, services), contact inbox, editor account management, video project creation/assignment, payment status, overview stats. |
| **Editor dashboard** (`/editor`) | Video editor(s) | Overview stats (earnings, pending payout, videos worked on), view only their own assigned video projects, post status/progress updates. Payment status is visible but never mutable by an editor. |

No public sign-up — every account is created by the admin. Editors receive a temporary password by email and are forced to set a new one on first login. Both roles can self-serve a password reset via email if they forget theirs.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript |
| Database | PostgreSQL via [Prisma Postgres](https://www.prisma.io/postgres) (Accelerate) |
| ORM | [Prisma 7](https://www.prisma.io) (custom `prisma-client` generator) |
| Auth | [Better Auth](https://www.better-auth.com) — email/password, admin plugin, custom role-based access control |
| UI | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com) (Radix primitives) |
| Animation | Framer Motion |
| Email | Nodemailer over Gmail SMTP, isolated in `src/services/mail.ts` for an easy provider swap |
| Validation | Zod, on every server action input |
| Hosting | Vercel |

## Project structure

```
src/
├── app/
│   ├── (public)/            # portfolio: home, about, work/[slug]
│   ├── (dashboard)/
│   │   ├── admin/           # admin-only routes
│   │   └── editor/          # editor + admin routes
│   ├── login/, forgot-password/, reset-password/, change-password/
│   └── api/auth/[...all]/   # Better Auth route handler
├── actions/                 # server actions (mutations), Zod-validated
├── services/                # business logic / Prisma queries
├── lib/                     # prisma client, auth config, guards, permissions, validations
├── components/
│   ├── ui/                  # shadcn primitives
│   ├── dashboard/           # admin/editor shell (sidebars, skeletons)
│   ├── public/               # portfolio sections
│   └── content/              # admin CRUD forms
└── proxy.ts                 # optimistic route protection (redirects only)

prisma/
├── schema.prisma
├── seed.ts                  # idempotent admin account seed
└── seed-content.ts          # draft launch content (case studies, safe to re-run)
```

`src/proxy.ts` is this Next.js version's middleware equivalent — it only redirects unauthenticated/unauthorized visitors away from dashboard routes. It is **not** the security boundary: every server action independently calls a guard (`requireAdmin` / `requireUser` / `requireOwnership`) from `src/lib/guards.ts` as its first line, which is what actually enforces access control server-side.

## Data model

Defined in `prisma/schema.prisma`. `User` / `Session` / `Account` / `Verification` are managed by Better Auth (`User.role` is `"admin" | "editor"`; password hashes live on `Account`, never on `User`).

| Model | Purpose |
|---|---|
| `VideoProject` | Title, description, `amount` (`Decimal(10,2)`), `status`, `paymentStatus`, `progress` (0–100), `deadline`, `estCompletion`, `editorId`. |
| `ProgressUpdate` | Append-only audit trail: note + progress snapshot per update, tied to a `VideoProject` and its author. |
| `Project` | Portfolio case study — title, unique `slug`, markdown `content`, `techStack[]`, `featured`/`published` flags. |
| `Testimonial` | Client review — name, role, content, rating, `published`. |
| `Service` | Service listing — title, description, `published`, manual `order`. |
| `ContactSubmission` | Public contact form submissions, with a `read` flag. |

`VideoStatus`: `NOT_STARTED → IN_PROGRESS → IN_REVIEW → COMPLETED`
`PaymentStatus`: `PAID | UNPAID` — money is always `Decimal`, never a float.

## Getting started

### Prerequisites

- Node.js 24.x
- [pnpm](https://pnpm.io) (version pinned in `package.json#packageManager`)
- A PostgreSQL database (this project targets [Prisma Postgres](https://www.prisma.io/postgres)/Accelerate, but any Postgres connection string works)
- A Gmail account with an [app password](https://support.google.com/accounts/answer/185833) for outgoing email

### Setup

```bash
git clone <repo-url>
cd alaminsheikh-portfolio
pnpm install
```

Copy the environment template and fill in real values (see [Environment variables](#environment-variables)):

```bash
cp .env.example .env
```

Push the schema to your database and seed the admin account:

```bash
pnpm dlx prisma db push
pnpm dlx prisma db seed
```

Optionally seed draft launch content (flagship case studies, as unpublished drafts):

```bash
npx tsx prisma/seed-content.ts
```

Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in at `/login` with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you seeded.

## Environment variables

All required at runtime; the app throws on startup / build if `DATABASE_URL` is missing, and Better Auth similarly requires its own secret and URL.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL / Prisma Accelerate connection string. |
| `BETTER_AUTH_SECRET` | Yes | Random secret used to sign sessions. Generate with `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | Yes | The app's own base URL (e.g. `http://localhost:3000` in dev, your production domain in prod). Used to build every auth callback and email link — **must** match the actual deployed domain in production. |
| `ADMIN_EMAIL` | Yes | Email for the seeded admin account. Also used as the recipient for contact-form and status-change notification emails. |
| `ADMIN_PASSWORD` | Yes | Initial password for the seeded admin account (seed script is idempotent — safe to re-run). |
| `ADMIN_NAME` | No | Display name for the seeded admin. Defaults to `"Admin"`. |
| `GOOGLE_CLIENT_ID` | Yes | The Gmail address used as the SMTP sender (despite the name, this holds the *email address*, not an OAuth client ID). |
| `GOOGLE_CLIENT_SECRET` | Yes | The Gmail **app password** for that address (not your Google account password). |
| `NEXT_PUBLIC_SITE_URL` | No | Public site URL used for SEO metadata (canonical URLs, sitemap, `robots.txt`). Falls back to `http://localhost:3000`. |

> `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are historically named for a Google OAuth client but are repurposed here to hold Gmail SMTP credentials — a preexisting naming quirk in this codebase, not an OAuth integration.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server (Turbopack) on `localhost:3000`. |
| `pnpm build` | `prisma generate` then `next build` — always regenerates the Prisma client first. |
| `pnpm start` | Start the production server (run `build` first). |
| `pnpm lint` | Run ESLint. |
| `pnpm dlx prisma studio` | Browse the database with Prisma Studio. |
| `pnpm dlx prisma db push` | Push `schema.prisma` changes to the database. This project uses `db push`, not tracked migrations — there is no `prisma/migrations` directory. |
| `pnpm dlx prisma db seed` | Run `prisma/seed.ts` (idempotent admin seed). |

## Authentication & roles

- Powered by [Better Auth](https://www.better-auth.com) with the `admin` plugin and a custom access-control policy (`src/lib/permissions.ts`) for the `admin` / `editor` roles.
- **No public sign-up.** The admin account is seeded from environment variables (`prisma/seed.ts`); editor accounts are created from the admin dashboard, which generates a random temporary password and emails it via `sendEditorInviteEmail`. New editors are forced to `/change-password` on first login (`mustChangePassword` flag).
- **Forgot password:** both roles can request a reset link from `/forgot-password`, delivered by email, valid for 1 hour (`/reset-password`). The endpoint never reveals whether an email is registered.
- **Login errors** never reveal whether the email or the password was the wrong part.
- **Ownership checks:** editors can only read/mutate video projects where `editorId` matches their own session — enforced in `src/lib/guards.ts`, not just hidden in the UI.
- **Payment mutation is admin-only, server-side**, regardless of what the UI shows — `togglePaymentStatusAction` calls `requireAdmin()` as its first line.

## Email

All outgoing email goes through `src/services/mail.ts` (Nodemailer + Gmail SMTP), intentionally isolated so swapping to a dedicated transactional provider (e.g. Resend) later is a one-file change. Current notification types:

- Editor invite (temporary password)
- Video assignment / reassignment notice (to the editor)
- Progress/status update notice (to the admin)
- Contact form submission notice (to the admin)
- Password reset link

Every send uses a display-name `from` header and a `replyTo` pointed at the relevant human counterpart, to reduce spam-filter false positives. Gmail-via-app-password is inherently more spam-prone than a dedicated transactional provider — if deliverability becomes an issue, swapping the internals of `mail.ts` is the intended fix path.

## Deployment

Deployed on [Vercel](https://vercel.com), auto-deploying from `main` via the GitHub integration.

```bash
vercel --prod
```

Production environment variables are managed with `vercel env add <NAME> production`. After changing any env var, redeploy (`vercel --prod`) — Vercel does not hot-reload env vars into a running deployment.

Before promoting to production, confirm:
- `BETTER_AUTH_URL` matches the live domain exactly (used to build every email link and auth callback).
- `pnpm build` succeeds locally (runs `prisma generate` first).

## Security notes

- Route protection in `src/proxy.ts` is **optimistic only** — it improves UX by redirecting unauthorized visitors, but it is not the enforcement layer.
- The actual enforcement is server-side, first line of every server action, via `requireAdmin()` / `requireUser()` / `requireOwnership()` in `src/lib/guards.ts`.
- Password hashes are never exposed in any API response (they live in Better Auth's `Account` table, not on `User`).
- Every server action input is validated with Zod before touching the database.
- Money is always `Decimal(10,2)` in the schema — never a floating-point number.
