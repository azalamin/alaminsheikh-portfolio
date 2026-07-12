# PRD — Personal Portfolio Website + Project Dashboard

**Owner:** Al Amin Sheikh
**Status:** Draft v1.4
**Last updated:** July 13, 2026

---

## 1. Overview

A personal portfolio website targeting premium clients, paired with a private dashboard for content management and video-editing project tracking. The system serves three surfaces from a single Next.js application:

1. **Public portfolio** — a minimalist, premium-feel site showcasing selected work, services, and testimonials.
2. **Admin dashboard** — full content management plus video project and payment oversight.
3. **Editor dashboard** — a restricted workspace where the video editor updates project status and progress.

## 2. Goals

- Present a premium, minimalist portfolio that converts high-value clients.
- Manage all portfolio content (projects, testimonials, services) from a dashboard without code changes.
- Track video editing projects end-to-end: assignment → progress → completion → payment.
- Give the editor a simple, restricted interface to report progress and status.
- Maintain a full, auditable history of progress updates and payment states.

### Non-goals (v1)

- Public user registration or accounts.
- Multiple editors with team management (schema supports it, UI optimized for one).
- Invoicing, payment gateway integration, or partial payments.
- Blog/CMS beyond case studies (may come in v2).

## 3. Users & Roles

| Role | Who | Access |
|------|-----|--------|
| **Admin** | Al Amin (seeded account) | Everything: content CRUD, user management, video projects, payment status |
| **Editor** | Video editor (created by Admin) | Only assigned video projects: update status, progress %, estimated completion, progress notes |
| **Visitor** | Public | Read-only public portfolio, contact form |

**Auth rules:**
- Login only — no public signup (`disableSignUp: true`).
- Admin account is seeded via environment variables (idempotent seed script).
- Admin creates editor accounts from the dashboard; the system generates a random temporary password and emails it to the editor automatically (via Gmail SMTP). Editor is forced to set a new password on first login.
- Both Admin and Editor can change their own password from the dashboard (built-in `changePassword`).
- Admin can deactivate/ban editor accounts; deactivated users cannot log in, but their historical records are preserved (never deleted).

## 4. Feature Requirements

### 4.1 Public Portfolio

- **Hero section** — outcome-focused headline, single CTA ("Start a project").
- **Selected work** — 4–6 featured case studies (problem → solution → result), pulled from DB, `featured` + `published` flags control visibility. Clean URLs via slugs (`/work/[slug]`). Each case study shows a quiet per-project stack line (from `techStack[]`).
  - **Flagship case studies (launch content):**
    1. Real Estate Digital Management System — production work at Unique Land Developer (high-level: problem, architecture, role; no internal business details; employer sign-off before publishing specifics).
    2. FoodHub — full-stack marketplace (RBAC, Better Auth, Prisma/Postgres, dual-architecture).
    3. Find English — founder story: founded, built, and grew an English learning platform (findenglishbd.com) with real users.
- **Services** — focused service listing.
- **Testimonials** — client reviews managed from dashboard, only `published` ones shown.
- **About** — short, personal, credible. Includes:
  - Current position: Software Engineer at Unique Land Developer Pvt. Ltd. (credibility anchor), with a brief experience timeline (internship as one line only).
  - Compact skills/tech stack section: grouped plain text (Frontend / Backend / Database / Tools), no logo grids or skill bars. Hardcoded for v1 (no Skill model).
  - One-line "Beyond the code" note on documentary-style content creation (geopolitics/history) — personality signal only, no dedicated section.
  - **Content exclusions (deliberate):** no training-course listings, no community awards, no "MERN developer" framing. Positioning: "engineer who ships real products for real organizations".
- **Contact form** — saves submission to DB and sends email notification to Admin.
- **Design direction:** minimalist premium — generous whitespace, max one accent color, refined typography, subtle restrained animations (Framer Motion), no skill bars or template clichés.
- **Performance:** static/ISR rendering for public pages, optimized images, Lighthouse 90+ targets.

### 4.2 Admin Dashboard

- CRUD: portfolio projects (case studies), testimonials, services.
- Draft/publish workflow via `published` flag; `featured` flag and manual ordering.
- View and mark-as-read contact submissions.
- **User management:** create editor accounts (name + email; temp password auto-generated and emailed), deactivate/reactivate (ban/unban).
- **Video projects:** create project (title, description, agreed amount, deadline), assign to editor.
- **Payment tracking:** toggle payment status — `PAID` / `UNPAID` only. Admin-exclusive.
- View per-project progress timeline (all editor updates, chronological).
- Dashboard overview: counts of active videos, unpaid amounts, unread messages.

### 4.3 Editor Dashboard

- See only video projects assigned to them.
- Update video status: `NOT_STARTED → IN_PROGRESS → IN_REVIEW → COMPLETED`.
- Update progress percentage (0–100) and estimated completion date.
- Post progress notes (e.g., "color grading done, sound design remaining"). Each update is stored as a new record — history is never overwritten.
- **Cannot** view or modify payment status, portfolio content, or other users.

## 5. Data Model (summary)

- **User / Session / Account / Verification** — generated by Better Auth CLI; User extended with `role` (admin | editor) via the admin plugin. Credentials (password hash) live in the Account table.
- **VideoProject** — title, description, amount (Decimal), status, paymentStatus (PAID | UNPAID), progress (0–100), deadline, estCompletion, editorId.
- **ProgressUpdate** — note, progress snapshot, videoProjectId, authorId, createdAt. Append-only audit trail.
- **Project** — portfolio case study: title, slug (unique), summary, content (markdown), coverImage, techStack[], liveUrl, featured, published, order.
- **Testimonial** — clientName, clientRole, content, rating, published.
- **ContactSubmission** — name, email, message, read flag.

Money is stored as `Decimal(10,2)` — never floats.

## 6. Technical Architecture

- **Framework:** Next.js (App Router) — single full-stack app, no separate backend.
- **Language:** TypeScript throughout.
- **Database:** PostgreSQL (Neon or Supabase — serverless-friendly) with Prisma ORM + connection pooling.
- **Auth:** Better Auth — email/password with public signup disabled, admin plugin (user creation, roles, ban/unban), built-in rate limiting and password policies. Auth tables generated into the Prisma schema via the Better Auth CLI (note: passwords are stored in the Account table, not on User).
- **UI:** TailwindCSS + shadcn/ui; Framer Motion for animation.
- **Validation:** Zod on every server action input.
- **Hosting:** Vercel.

**Folder structure:**

```
src/
├── app/
│   ├── (public)/       # portfolio pages
│   ├── (dashboard)/
│   │   ├── admin/
│   │   └── editor/
│   └── api/
├── actions/            # server actions
├── services/           # business logic / Prisma queries
├── lib/                # prisma, auth, guards, utils
└── components/
```

**Security requirements:**
- Role guard (`requireAdmin` / `requireUser`) called as the first line of every server action — middleware handles redirects only, guards handle security.
- Password hashing, rate limiting, and session security handled by Better Auth. Password hashes never exposed in any API response.
- Login errors never reveal whether email or password was wrong.
- Editors can only mutate video projects where `editorId` matches their session id (ownership check in every editor action).

## 7. Milestones

| # | Milestone | Includes |
|---|-----------|----------|
| 1 | Foundation | Repo, Prisma schema, DB, seed script, Auth.js + roles, middleware, guards |
| 2 | Video tracking core | Video project CRUD (admin), editor status/progress updates, progress timeline, payment toggle |
| 3 | Admin content CRUD | Projects, testimonials, contact submissions, user management |
| 4 | Public portfolio | All public pages, design system, contact form, SEO, performance pass |
| 5 | Polish & launch | Email notifications (status change, new contact), dashboard overview stats, deploy to Vercel, seed production admin |

## 8. Success Criteria

- Admin can create an editor, assign a video, and see progress updates without touching code.
- Editor can log in and update only their own projects; payment fields are invisible/immutable to them.
- Public site loads fast (Lighthouse 90+), looks premium on mobile and desktop.
- All content changes go live from the dashboard alone.
- Complete progress + payment history retained for every video project.

## 9. Decisions Log

- **Auth library:** Better Auth (Auth.js is now maintained by the Better Auth team; Better Auth recommended for new projects).
- **Email:** Gmail SMTP via Nodemailer (app password, isolated in `services/mail.ts` so a later swap to Resend is one file).
- **Image hosting:** Cloudinary for case study covers and media.
- **Domain:** Vercel free subdomain for launch; custom domain (alaminsheikh.com) later — DNS-only change.
- **Payment states:** strictly PAID / UNPAID, admin-only toggle.
- **Auto-archive:** videos that are COMPLETED + PAID are automatically moved out of the editor's active list into an archive view (still visible to Admin, and to Editor under an "Archived" tab).


