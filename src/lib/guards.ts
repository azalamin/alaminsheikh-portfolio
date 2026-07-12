import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

export class UnauthorizedError extends Error {
  constructor(message = "You must be signed in to do this.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to do this.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** First line of every server action: fails closed if there is no signed-in, non-banned user. */
export async function requireUser() {
  const session = await getSession();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}

/** First line of every admin-only server action. */
export async function requireAdmin() {
  const session = await requireUser();
  if (session.user.role !== "admin") {
    throw new ForbiddenError("Admin access required.");
  }
  return session;
}

/** First line of every editor server action. */
export async function requireEditor() {
  const session = await requireUser();
  if (session.user.role !== "editor") {
    throw new ForbiddenError("Editor access required.");
  }
  return session;
}

/** Editors may only mutate video projects assigned to them; call after requireEditor(). */
export function requireOwnership(resourceEditorId: string | null, userId: string) {
  if (resourceEditorId !== userId) {
    throw new ForbiddenError("You do not own this project.");
  }
}
